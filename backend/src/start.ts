import { WeatherService } from './services/weather.service';
import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import {
   createLogger,
   format,
   transports
} from 'winston';
import WeatherDataCache from './cache/weather-data.cache';
import { Tedis } from 'tedis';


(async () => {
   dotenv.config();

   const logger = createLogger({
      level: 'info',
      format: format.combine(
         format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
         format.colorize({
            level: true
         }),
         format.printf(
            info => `${info.level} [${info.timestamp}]: ${info.message}`
         )
      ),
      transports: [
         new transports.Console(),
      ],
   });

   const weatherService = new WeatherService();
   const tedis = new Tedis({
      port: 6379,
      host: "127.0.0.1"
   });

   const cacheService = new WeatherDataCache(
      tedis,
      weatherService
   );

   const app = express();

   app.use(express.json());
   app.use(cors());

   app.get('/data', async (req: Request, res: Response) => {
      logger.info('Refresh dashboard data');

      res.status(200).send(await cacheService.get());
   });

   const port = process.env.PORT;
   app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
   });
})();
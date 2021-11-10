import { WeatherAlertsService } from './services/weather-alerts.service';
import { ForecastService } from './services/forecast.service';
import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import {
   createLogger,
   format,
   transports
} from 'winston';
import * as schedule from 'node-schedule';
import CacheService from './services/cache.service';
import { WeatherData } from './@types/type';


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

   const cacheService = new CacheService();
   const forecastService = new ForecastService();
   const alertsService = new WeatherAlertsService();

   const loadWeatherData = async () => {
      console.log('Load weather data');
      const data: WeatherData = {
         forecasts: await forecastService.getForecast(),
         alerts: await alertsService.getAlerts()
      };

      cacheService.set(data);
   };

   const rule = new schedule.RecurrenceRule();
   rule.minute = new schedule.Range(0, 59, 5);

   schedule.scheduleJob(rule, loadWeatherData);
   await loadWeatherData();

   const app = express();

   app.use(express.json());
   app.use(cors());

   app.get('/data', async (req: Request, res: Response) => {
      logger.info('Refresh dashboard data');

      res.status(200).send(cacheService.get());
   });

   const port = process.env.PORT;
   app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
   });
})();
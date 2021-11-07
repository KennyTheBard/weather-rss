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

const app = express();

app.use(express.json());
app.use(cors());

const forecastService = new ForecastService();
const alertsService = new WeatherAlertsService();

app.get('/data', async (req: Request, res: Response) => {
   logger.info('Refresh dashboard data');

   res.status(200).send({
      forecasts: await forecastService.getForecast(),
      alerts: await alertsService.getAlerts()
   });
});

const port = process.env.PORT;
app.listen(port, () => {
   console.log(`App listening on the port ${port}`);
});
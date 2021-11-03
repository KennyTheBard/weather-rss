import { WeatherAlertsService } from './services/weather-alerts.service';
import { ForecastService } from './services/forecast.service';
import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const forecastService = new ForecastService();
const alertsService = new WeatherAlertsService();

app.get('/data', async (req: Request, res: Response) => {
   res.status(200).send({
      forecasts: await forecastService.getForecast(),
      alerts: await alertsService.getAlerts()
   });
});

const port = process.env.PORT;
app.listen(port, () => {
   console.log(`App listening on the port ${port}`);
});
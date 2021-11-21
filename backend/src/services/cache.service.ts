import { WeatherService } from './weather.service';
import { scheduleJob } from 'node-schedule';
import { AlertData, CountryForecast, WeatherData } from './../@types/type.d';


export default class WeatherDataCache {

   private cachedData: WeatherData;

   constructor(
      private readonly weatherService: WeatherService,
   ) {
      scheduleJob('*/1 * * * *', this.updateData)
   }

   get(): WeatherData {
      return this.cachedData;
   }

   updateData = async () => {
      let forecasts: CountryForecast[];
      let alerts: AlertData[];

      try {
         forecasts = await this.weatherService.getForecast();
         alerts = await this.weatherService.getAlerts();
      } catch (e) {
         console.error(e);
         return;
      }

      const data: WeatherData = {
         forecasts,
         alerts
      };
      this.cachedData = data;
   }

}
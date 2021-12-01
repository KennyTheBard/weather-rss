import { WeatherService } from '../services/weather.service';
import { scheduleJob } from 'node-schedule';
import { CountryForecast, WeatherData } from '../@types/type';
import { Tedis } from 'tedis';
import moment from 'moment';


const REDIS_KEY = 'weather';

export default class WeatherDataCache {

   private cachedData: WeatherData;

   constructor(
      private readonly tedis: Tedis,
      private readonly weatherService: WeatherService,
   ) {
      scheduleJob('*/2 * * * *', this.updateData);
   }

   async get(): Promise<WeatherData> {
      if (this.cachedData !== undefined) {
         return this.cachedData;
      }

      const redisData = await this.tedis.get(REDIS_KEY);

      if (redisData !== undefined) {
         return JSON.parse(redisData as string);
      }

      return {
         forecasts: [],
         alerts: [],
         timestamp: moment().valueOf(),
      };
   }

   updateData = async () => {
      let forecasts: CountryForecast[];
      let alerts: string[];

      try {
         forecasts = await this.weatherService.getForecast();
         alerts = await this.weatherService.getAlerts();
      } catch (e) {
         console.error(e);
         return;
      }

      const data: WeatherData = {
         forecasts,
         alerts,
         timestamp: moment().valueOf()
      };
      this.cachedData = data;
      this.tedis.set(REDIS_KEY, JSON.stringify(data));
      console.log('Successfully updated data')
   }

}
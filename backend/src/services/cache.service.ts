import { WeatherData } from './../@types/type.d';


export default class CacheService {

   private cachedData: WeatherData;

   get(): WeatherData {
      return this.cachedData;
   }

   set(value: WeatherData) {
      this.cachedData = value;
   }

}
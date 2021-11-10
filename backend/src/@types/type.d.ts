export type WeatherData = {
   alerts: string[];
   forecasts: CountryForecast[];
}

export type CountryForecast = {
   name: string;
   date: string;
   forecasts: DailyForecast[];
}

export type DailyForecast = {
   date: string;
   temp: TemperatureInterval;
   description: string;
}

export type TemperatureInterval = {
   min: number;
   max: number;
}
export type WeatherData = {
   alerts: AlertData[];
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

export type AlertData = {
   code: string,
   date: string;
   zones: string;
   betweenHours: string;
   description: string;
}
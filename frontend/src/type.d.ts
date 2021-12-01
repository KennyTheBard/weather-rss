export type AppData = {
   forecasts: CountryForecast[];
   alerts: string[];
   timestamp?: number;
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

import moment from 'moment';
import { DailyForecast } from '../type';


export interface ForecastDayProps {
   forecast: DailyForecast
}

export default function ForecastDay(props: ForecastDayProps) {
   const fc = props.forecast;

   return <div className='forecast-country-daily-day'>
      <div className='forecast-country-daily-day-date'>
         {moment(fc.date, 'YYYY-MM-DD').format('D MMM')}
      </div>
      <div className='forecast-country-daily-day-temp'>
         {fc.temp.min}°C to {fc.temp.max}°C
      </div>
      <span className='forecast-country-daily-day-tooltip'>
         {fc.description.toLowerCase()}
      </span>
   </div>;
} 
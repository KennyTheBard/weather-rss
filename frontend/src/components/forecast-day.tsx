import moment from 'moment';
import { DailyForecast } from '../type';


export interface ForecastDayProps {
   forecast: DailyForecast
}

export default function ForecastDay(props: ForecastDayProps) {
   const fc = props.forecast;

   return <div>
      <div>
         {moment(fc.date, 'YYYY-MM-DD').format('D MMM')}
      </div>
      <div>
         {fc.temp.min}-{fc.temp.max}°C
      </div>
   </div>;
} 
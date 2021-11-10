import { CountryForecast } from '../type';
import ForecastDay from './forecast-day';


export interface ForecastCountryProps {
   forecast: CountryForecast
}

export default function ForecastCountry(props: ForecastCountryProps) {
   const fc = props.forecast;

   return <div className='forecast-country'>
      <div className='forecast-country-name'>
         {fc.name}
      </div>
      <div className='forecast-country-daily'>
         {fc.forecasts.map(f => <ForecastDay forecast={f}></ForecastDay>)}
      </div>
   </div>;
} 
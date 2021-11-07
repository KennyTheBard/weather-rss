import axios from 'axios';
import { parse as xmlParse } from 'fast-xml-parser';
import { CountryForecast } from '../@types/type';


export class ForecastService {
   getForecast = async (): Promise<CountryForecast[]> => {
      const res = await axios.get('https://www.meteoromania.ro/anm/prognoza-orase-xml.php');
   
      const jsonObj = xmlParse(res.data, {
         attributeNamePrefix : "@_",
         parseAttributeValue: true,
         ignoreAttributes : false
      });
      return jsonObj['Prognoza_AdmNatMeteorologie_Romania'].tara.localitate.map((l: any) => buildCountryForecast(l));
   }  
}

const buildCountryForecast = (jsonForecast: any): CountryForecast => {
   return {
      name: jsonForecast['@_nume'],
      date: jsonForecast['DataPrognozei'],
      forecasts: jsonForecast.prognoza.map((p: any) => {
         return {
            date: p['@_data'],
            description: p['fenomen_descriere'],
            temp: {
               min: p['temp_min']['#text'],
               max: p['temp_max']['#text']
            }
         }
      })
   };
}
import { AppData } from './../type.d';
import axios from 'axios';
import { CountryForecast } from '../type';
import { parse as xmlParse } from 'fast-xml-parser';
import Parser from 'rss-parser';


const rss: Parser = new Parser({
   defaultRSS: 2.0,
   xml2js: {
      emptyTag: '--EMPTY--',
   }
});

const FORECAST_URL = 'https://www.meteoromania.ro/anm/prognoza-orase-xml.php';

const DataService = {
   getFreshData: async (): Promise<AppData> => {
      return {
         forecasts: await getForecasts(),
         alerts: await getAlerts()
      }
   }
}

const getForecasts = async (): Promise<CountryForecast[]> => {
   const res = await axios({
      url: FORECAST_URL,
      method: 'get',
      proxy: {
         host: 'https://www.meteoromania.ro',
         port: 80
      }
   });

   const jsonObj = xmlParse(res.data, {
      attributeNamePrefix : "@_",
      parseAttributeValue: true,
      ignoreAttributes : false
   });
   return jsonObj['Prognoza_AdmNatMeteorologie_Romania'].tara.localitate.map((l: any) => buildCountryForecast(l));
}

const getAlerts = async (): Promise<string[]> => {
   const alertsFeed = await rss.parseURL('https://www.meteoromania.ro/anm2/avertizari-rss.php');
      
   return alertsFeed.items.map((i: any) => i.content).map((i: any) => i as string);
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
               min: p['temp_min'],
               max: p['temp_max']
            }
         }
      })
   };
}

export default DataService;
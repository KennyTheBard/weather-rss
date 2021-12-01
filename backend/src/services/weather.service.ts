import Parser from 'rss-parser';
import axios from 'axios';
import { parse as xmlParse } from 'fast-xml-parser';
import { CountryForecast } from '../@types/type';


export class WeatherService {
   private readonly rss: Parser;

   constructor() {
      this.rss = new Parser({
         defaultRSS: 2.0,
         xml2js: {
            emptyTag: '--EMPTY--',
         }
      });
   }

   getForecast = async (): Promise<CountryForecast[]> => {
      const res = await axios.get('https://www.meteoromania.ro/anm/prognoza-orase-xml.php');

      const jsonObj = xmlParse(res.data, {
         attributeNamePrefix: "@_",
         parseAttributeValue: true,
         ignoreAttributes: false
      });
      return jsonObj['Prognoza_AdmNatMeteorologie_Romania'].tara.localitate.map((l: any) => this.buildCountryForecast(l));
   }

   getAlerts = async (): Promise<string[]> => {
      const alertsFeed = await this.rss.parseURL('https://www.meteoromania.ro/anm2/avertizari-rss.php');
      return alertsFeed.items
         .map(i => i.content)
         .map(i => i as string)
         .filter(i => i !== null);
   }

   private buildCountryForecast = (jsonForecast: any): CountryForecast => {
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
}
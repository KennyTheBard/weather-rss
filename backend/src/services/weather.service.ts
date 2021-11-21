import Parser from 'rss-parser';
import axios from 'axios';
import { parse as xmlParse } from 'fast-xml-parser';
import { AlertData, CountryForecast } from '../@types/type';


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

   getAlerts = async (): Promise<AlertData[]> => {
      const alertsFeed = await this.rss.parseURL('https://www.meteoromania.ro/anm2/avertizari-rss.php');
      return alertsFeed.items
         .map(i => i.content)
         .map(i => i as string)
         .map(i => this.extractAlertData(i))
         .filter(i => i !== null);
   }

   private extractAlertData = (content: string): AlertData => {
      const clearedContent = content.split(/\s+/).join(' ').split(/<.*?>/).map(e => e.trim()).filter(e => e.length > 0);
      if (clearedContent[0] === 'Nu sunt avertizari meteo !') {
         return null;
      }

      return {
         code: clearedContent.find(s => s.includes('COD :')).split(':').slice(1).join(':').trim(),
         date: clearedContent.find(s => s.includes('Ziua/luna/anul :')).split(':').slice(1).join(':').trim(),
         zones: clearedContent.find(s => s.includes('In zona :')).split(':').slice(1).join(':').trim(),
         betweenHours: clearedContent.find(s => s.includes('Intre orele :')).split(':').slice(1).join(':').trim(),
         description: clearedContent.find(s => s.includes('Se vor semnala :')).split(':').slice(1).join(':').trim()
      };
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
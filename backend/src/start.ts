import axios from 'axios';
import Parser from 'rss-parser';
import { parse as xmlParse } from 'fast-xml-parser';

const rss: Parser = new Parser({
   defaultRSS: 2.0,
   xml2js: {
      emptyTag: '--EMPTY--',
   }
});

async function bootstrap() {
   try {
      const alertsFeed = await rss.parseURL('https://www.meteoromania.ro/anm2/avertizari-rss.php');
      
      alertsFeed.items.map(i => i.content).forEach(i => console.log(i));

      const res = await axios.get('https://www.meteoromania.ro/anm/prognoza-orase-xml.php');

      const jsonObj = xmlParse(res.data, {
         attributeNamePrefix : "@_",
         parseAttributeValue: true,
         ignoreAttributes : false
      });
      const forecasts: CountryForecast[] = jsonObj['Prognoza_AdmNatMeteorologie_Romania'].tara.localitate.map(l => buildCountryForecast(l));
      console.log(forecasts);

   } catch (e) {
      console.error(e);
   }
}

const buildCountryForecast = (jsonForecast: any): CountryForecast => {
   return {
      name: jsonForecast['@_nume'],
      date: jsonForecast['DataPrognozei'],
      forecasts: jsonForecast.prognoza.map(p => {
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

interface CountryForecast {
   name: string;
   date: string;
   forecasts: DailyForecast[];
}

interface DailyForecast {
   date: string;
   temp: TemperatureInterval;
   description: string;
}

interface TemperatureInterval {
   min: number;
   max: number;
}

bootstrap();
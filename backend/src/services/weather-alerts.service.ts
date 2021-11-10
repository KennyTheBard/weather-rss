import Parser from 'rss-parser';
import { AlertData } from '../@types/type';


export class WeatherAlertsService {
   private readonly rss: Parser;

   constructor() {
      this.rss = new Parser({
         defaultRSS: 2.0,
         xml2js: {
            emptyTag: '--EMPTY--',
         }
      });
   }

   getAlerts = async (): Promise<AlertData[]> => {
      const alertsFeed = await this.rss.parseURL('https://www.meteoromania.ro/anm2/avertizari-rss.php');
      return alertsFeed.items.map((i: any) => i.content).map((i: any) => i as string).map((i => this.extractAlertData(i))).map(i => {console.log(i); return i;});
   }

   private extractAlertData = (content: string): AlertData => {
      const clearedContent = content.split(/\s+/).join(' ').split(/<.*?>/).map(e => e.trim()).filter(e => e.length > 0);

      return {
         code: clearedContent.find(s => s.includes('COD :')).split(':').slice(1).join(':').trim(),
         date: clearedContent.find(s => s.includes('Ziua/luna/anul :')).split(':').slice(1).join(':').trim(),
         zones: clearedContent.find(s => s.includes('In zona :')).split(':').slice(1).join(':').trim(),
         betweenHours: clearedContent.find(s => s.includes('Intre orele :')).split(':').slice(1).join(':').trim(),
         description: clearedContent.find(s => s.includes('Se vor semnala :')).split(':').slice(1).join(':').trim()
      };
   }
}
import Parser from 'rss-parser';


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

   getAlerts = async (): Promise<string[]> => {
      const alertsFeed = await this.rss.parseURL('https://www.meteoromania.ro/anm2/avertizari-rss.php');
         
      return alertsFeed.items.map((i: any) => i.content).map((i: any) => i as string);
   }
}
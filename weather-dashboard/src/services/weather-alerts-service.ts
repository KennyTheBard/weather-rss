import Parser from 'rss-parser';

const rss: Parser = new Parser({
   defaultRSS: 2.0,
   xml2js: {
      emptyTag: '--EMPTY--',
   }
});

const WeatherAlertsService = {
   getAlerts: async (): Promise<string[]> => {
      const alertsFeed = await rss.parseURL('https://www.meteoromania.ro/anm2/avertizari-rss.php');
      
      return alertsFeed.items.map((i: any) => i.content).map((i: any) => i as string);
   }
}

export default WeatherAlertsService;
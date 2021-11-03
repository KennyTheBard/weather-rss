import Parser from 'rss-parser';

const rss: Parser = new Parser({
   defaultRSS: 2.0,
   xml2js: {
      emptyTag: '--EMPTY--',
   }
});


async function bootstrap() {
   try {
      const alertsFeed = await rss.parseURL('https://www.meteoromania.ro/anm2/avertizari-rss.php');
      const forecastFeed = await rss.parseURL('https://www.meteoromania.ro/anm/prognoza-orase-xml.php');
      
      forecastFeed.items.forEach(i => console.log(Object.keys(i)));
   } catch (e) {
      console.error(e);
   }
}


bootstrap();
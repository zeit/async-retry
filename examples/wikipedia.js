import retry from '../';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

const getRandomTitle = async (t) => {
  return await retry(async () => {
    const res = await fetch('https://en.wikipedia.org/wiki/Special:Random');
    const text = await res.text();
    const $ = cheerio.load(text);
    return $('h1').text();
  });
}

getRandomTitle().then(console.log);

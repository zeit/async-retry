/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import retry from '..';
/* eslint-enable import/no-extraneous-dependencies, import/no-unresolved */

const getRandomTitle = async () =>
  retry(async () => {
    const res = await fetch('https://en.wikipedia.org/wiki/Special:Random');
    const text = await res.text();
    const $ = cheerio.load(text);
    return $('h1').text();
  });

// eslint-disable-next-line no-console
getRandomTitle().then(console.log);

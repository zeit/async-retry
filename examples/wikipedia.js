import fetch from 'node-fetch'
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import cheerio from 'cheerio'
import retry from '../' // eslint-disable-line import/no-unresolved

const getRandomTitle = async () => {
  return await retry(async () => {
    const res = await fetch('https://en.wikipedia.org/wiki/Special:Random')
    const text = await res.text()
    const $ = cheerio.load(text)
    return $('h1').text()
  })
}

getRandomTitle().then(console.log)

const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/George_Washington';

rp(url)
  .then(function(html) {
    let bday = $('.bday', html).text();
    let name = $('.firstHeading', html).text();
    console.log(name, bday);
  })
  .catch(function(err) {
    //handle error
  });
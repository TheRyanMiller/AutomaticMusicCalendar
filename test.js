const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'http://www.theroyalamerican.com/';
//const url = 'https://www.google.com';

var options = {
    uri: url,
    simple: true,
    resolveWithFullResponse: true
};

rp(options)
  .then(function(resp) {
    //console.log(cheerio('h1.eventlist-title' , $));
    console.log(resp);
   })
  .catch(function(err) {
     console.log(err);
    //handle error
  });
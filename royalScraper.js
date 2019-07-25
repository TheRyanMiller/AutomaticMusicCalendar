const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://theroyalamerican.com/schedule';

var options = {
    uri: url,
    simple: true,
    resolveWithFullResponse: true,
    headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "user-agent": "'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'"
    }
};

rp(options)
  .then(function(html) {
    //console.log(cheerio('h1.eventlist-title' , $));
    //let articles = $('article', html);
    let articles = $('article', html.body);
    
    for(let i=0;i<articles.length;i++){
        
        //Artist
        let artist = $(".eventlist-title-link", articles[i]).text();
        console.log("Artist: "+artist);

        //Opener
        let opener = "n/a";
        let openerStr = $("p", articles[i]).text();
        if(openerStr.indexOf("w/ ")>-1){
            opener = openerStr.substring(3,openerStr.indexOf("Doors:"));
        }
        else{
            opener = openerStr.substring(0,openerStr.indexOf("Doors:"));
        }
        console.log("Opener: "+opener);

        //Doors
        let doors = "";
        if(openerStr.indexOf("Doors:")>-1){
            doors=openerStr.substring(openerStr.indexOf("Doors:")+7, openerStr.indexOf(" | "));
        }
        console.log("Doors: "+doors);
        console.log();
    }
   })
  .catch(function(err) {
     console.log(err);
    //handle error
  });
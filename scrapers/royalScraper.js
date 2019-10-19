const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://theroyalamerican.com/schedule';
var moment = require('moment');


var options = {
    uri: url,
    simple: true,
    resolveWithFullResponse: true,
    headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "user-agent": "'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'"
    }
};

module.exports = new Promise(function(resolve, reject){
    rp(options)
    .then(function(html) {

        let includePastShows = true;
        let royalBaseUrl="https://www.theroyalamerican.com";
        //Get upcoming Shows only
        let articles = $('article', html.body).not('.eventlist-event--past');
        if(includePastShows){articles = $('article', html.body);}
        let eventList = [];
        let event = {};
        for(let i=0;i<articles.length;i++){
            /*
                Before stripping out data, do a round of sub-tag checking for things link
                <STRONG> which we know is often used for all day events D!Z for example
            */ 
            event = {};
            
          
            //Artist
            let title = exports.parseArtist(articles[i]);
            let showUrl = $(".eventlist-title-link", articles[i]).attr('href');

            //Date
            let dateStr = "";
            dateStr = $(".event-date", articles[i]).contents().first().text();
            //da = dateStr.split(",")
            var da = [];
            dateStr.split(",").map(function(item) {
                item = item.trim();
                newItem = item.split(" ");
                if(newItem.length>1){
                    newItem.map((i)=>{
                        da.push(i);
                    })
                }
                else{
                    da.push(item);
                }
            });
            const myMoment = moment(da[3]+"-"+da[1]+"-"+da[2], 'YYYY-MMM-DD');
            //console.log(new Date(myMoment));
            eventDate = new Date(myMoment);
            //console.log(new Date(myMoment))
            //console.log(eventDate)

            //Opener
            let opener = "n/a";
            let openerStr = $("p", articles[i]).text();
            if(openerStr.indexOf("w/ ")>-1){
                opener = openerStr.substring(3,openerStr.indexOf("Doors:"));
            }
            else{
                opener = openerStr.substring(0,openerStr.indexOf("Doors:"));
            }

            //Doors
            let doors = "";
            if(openerStr.indexOf("Doors:")>-1){
                doors=openerStr.substring(openerStr.indexOf("Doors:")+7, openerStr.indexOf(" | "));
            }
            let cover ="";
            if(openerStr.indexOf(" | ")>-1){
                cover=openerStr.substring(openerStr.indexOf(" | ")+3,openerStr.length).split(" ")[0].trim();   
                if(cover.length>3){
                    cover=cover.substring(0,2);
                }
            }
            event.title = title;
            if(opener && opener!="")event.opener = opener;
            event.location = "The Royal American";
            event.eventDate = eventDate;
            if(doors && doors!="")event.time= doors;
            if(cover && cover!="")event.fee = cover;
            event.locAcronym = "ra";
            //event.infoLink = ev.url;
            //event.fee = feeInTitle ? titleArr.join("") : "";
            if(showUrl && showUrl!="") event.showUrl=royalBaseUrl+showUrl;
            eventList.push(event);
            
        }
        resolve(eventList);
        
        //console.log("Total shows: "+eventList.length);
    })
    .catch(function(err) {
        console.log(err);
        //handle error
    });
    
});

exports.parseArtist = function(article){
    return $(".eventlist-title-link", article).text();
};
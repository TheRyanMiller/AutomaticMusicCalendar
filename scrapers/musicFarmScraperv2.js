const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://music-farm.com/events/';
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
        //Get upcoming Shows only
        let eventDivs = $('div.eventWrapper.rhinoSingleEvent', html.body);
        let eventList = [];
        let event = {};
        let infoDiv;
        let eventTimes;
        let showUrl;
        let fee;
        let eventTimeStr;
        let title;
        let months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","nov","dec"];
        let date;
        let dateStr;
        

        for(let i=0;i<eventDivs.length;i++){
            /*
                Before stripping out data, do a round of sub-tag checking for things link
                <STRONG> which we know is often used for all day events D!Z for example
            */ 
            event = {};
            infoDiv = $(".rhino-event-info", eventDivs[i]);

            //Artist
            title = $("#eventTitle", infoDiv).text().trim();
            showUrl = $("#eventTitle", infoDiv).attr('href');
            
            //Other Info
            eventTimeStr = $(".eventDoorStartDate", infoDiv).text();
            fee = $(".eventCost", infoDiv).text().trim();
            eventTimes = parseTimes(eventTimeStr);

            //Date
            dateStr = $(".singleEventDate", eventDivs[i]).text();
            let currentMonth = moment().month();
            let targetMonth = moment(new Date(dateStr+' 2019')).month();
            year = moment().year();
            if(targetMonth < currentMonth){
              year = moment().year()+1; 
            }
            date = new Date(dateStr+' '+year);
            
            event.title = title;
            event.eventDate = date;
            if(eventTimes.doors) event.doorsTime = eventTimes.doors;
            if(eventTimes.start) event.showTime = eventTimes.start;
            event.location = "The Music Farm - Charleston";
            if(fee) event.fee = fee;
            event.locAcronym = "MF";
            if(showUrl) event.showUrl = showUrl;
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

function parseTimes(str){
  times = {
    "start":"",
    "doors":""
  }
  times.start = str.substring(9 ,str.indexOf("//")-1)
  times.doors = str.substring(str.indexOf("//")+11,str.length-1)
  return times;
}
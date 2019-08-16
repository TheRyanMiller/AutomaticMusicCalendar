var ical = require('node-ical');
const rp = require('request-promise');
const url = 'https://tockify.com/api/feeds/ics/tinroofschedule';
let icalHtml = "";



let event = {
    title: "", 
    location: "Tin Roof - Charleston",
    eventDate: "",
    time:""
}

let exclusions = [
  'matzo',
  'trivia',
  'trivia!',
  'karaoke!',
  'karaoke',
  'brunch',
  'brunch!',
  'food',
  'comedy',
  'comdey!',
]

function wordInString(title, exclusions) {
  return title.split(" ").some(Array.prototype.includes.bind(exclusions));
}

let eventList = [];

module.exports = new Promise(function(resolve, reject){
  ical.fromURL(url, {}, function (err, data) {
    for (let k in data) {
      event = {};
      if (data.hasOwnProperty(k)) {
        var ev = data[k];
        if (data[k].type == 'VEVENT' &&  !wordInString(ev.summary.toLowerCase(), exclusions)) {
          //Titles look like this: Forsaken Profits / Cult of Bastards / Blue Ricky $7
          let titleArr = ev.summary.replace(/(\r\n|\n|\r)/gm, "").split(/(?=\$)/);
          let title = "";
          let feeInTitle = titleArr.length > 1;
          if(feeInTitle){
            title = titleArr.shift();
            title = title.substring(0,title.length-1);
          }
          else{
            title = titleArr[0];
          }
          event.title = title;
          event.eventDate = new Date(new Date(ev.start).setUTCHours(0,0,0,0));
          event.time= ev.start.toLocaleTimeString('en-US');
          event.infoLink = ev.url;
          event.fee = feeInTitle ? titleArr.join("") : "";
          eventList.push(event);
          
        }
        
      }
      
    }
    //console.log(eventList);
    resolve(eventList);
  })
})

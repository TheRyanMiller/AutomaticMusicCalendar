var ical = require('node-ical');
const rp = require('request-promise');
const url = 'https://tockify.com/api/feeds/ics/tinroofschedule';
let icalHtml = "";


const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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

ical.fromURL(url, {}, function (err, data) {
  for (let k in data) {
    if (data.hasOwnProperty(k)) {
      var ev = data[k];
      if (data[k].type == 'VEVENT' &&  !wordInString(ev.summary.toLowerCase(), exclusions)) {
        event.title = ev.summary; 
        event.eventDate = ev.start;
        event.time= ev.start.toLocaleTimeString('en-GB');
        event.infoLink = ev.url;
        eventList.push(ev);
      }
      
    }
  }
  console.log(eventList);
})
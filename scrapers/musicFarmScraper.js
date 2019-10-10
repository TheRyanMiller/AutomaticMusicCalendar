var ical = require('node-ical');
const url = 'https://music-farm.com/events/?ical=1&tribe_display=list';


//const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let event = {
    title: "", 
    location: "Music Farm - Charleston",
    eventDate: "",
    time:""
}

let eventList = [];

module.exports = new Promise(function(resolve, reject){
  ical.fromURL(url, {}, function (err, data) {
    for (let k in data) {
      event = {};
      if (data.hasOwnProperty(k)) {
        var ev = data[k];
        if (data[k].type == 'VEVENT') {
          event.title = ev.summary;
          event.location = "The Music Farm - Charleston"//ev.location; 
          event.eventDate = new Date(new Date(ev.start).setUTCHours(0,0,0,0));
          event.time= ev.start.toLocaleTimeString('en-US');
          event.infoLink = ev.url;
          event.locAcronym = "mf";
          eventList.push(event);
        }
        
      }
    }
    resolve(eventList);
  })
})
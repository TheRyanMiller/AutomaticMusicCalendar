var ical = require('node-ical');
const rp = require('request-promise');
const url = 'https://music-farm.com/events/?ical=1&tribe_display=list';
let icalHtml = "";


const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let event = {
    title: "", 
    location: "",
    eventDate: "",
    time:""
}

ical.fromURL(url, {}, function (err, data) {
  for (let k in data) {
    if (data.hasOwnProperty(k)) {
      var ev = data[k];
      if (data[k].type == 'VEVENT') {
        event.title = ev.summary;
        event.location = ev.location; 
        event.eventDate = ev.start;
        event.time= ev.start.toLocaleTimeString('en-GB');
        event.infoLink = ev.url;
      }
      console.log(event);
    }
  }
})
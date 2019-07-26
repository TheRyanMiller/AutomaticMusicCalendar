var ical = require('node-ical');
const rp = require('request-promise');
const url = 'https://music-farm.com/events/?ical=1&tribe_display=list';
let icalHtml = "";


const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let event = {
    artist: "", 
    location: "",
    startDate: "",
    month: "",
    time:""
}

ical.fromURL(url, {}, function (err, data) {
  for (let k in data) {
    if (data.hasOwnProperty(k)) {
      var ev = data[k];
      if (data[k].type == 'VEVENT') {
        event.artist = ev.summary;
        event.location = ev.location; 
        event.startDate = ev.start.getDate();
        event.month = months[ev.start.getMonth()];
        event.time= ev.start.toLocaleTimeString('en-GB');
      }
      console.log(event);
    }
  }
});
const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://charlestonpourhouse.com/';
const moment = require('moment');

rp(url)
  .then(function(html) {
    const showArticles = [];
    let allArticles = $('article', html);
    let wrapper = [];
    let showHeaders = [];
    console.log(html);
    console.log("Number of articles: "+allArticles.length);

    //Get all headers
    showHeaders = $('header.show-header', html); 
    //console.log(showHeaders.length);

    let showList = [];
    let showtime = "";
    let artist = "";
    let venue = "";
    let cover = "?";
    let doorsTime = "";
    let showTime = "";
    let fbLink = "";
    let infoLink = "";
    let ticketLink = "";
    let show = {};

    //for (let i = 0; i < allArticles.length; i++) {
    for (let i = 0; i < 9; i++) {
      show = {};
      artist = $('h3', allArticles[i]).text();
      venue = $('h2', allArticles[i]).text();
      //Handle Date
      showtime = $('.show-day', allArticles[i]).text();
      let re1 = new RegExp(', (.*?), ');
      let dateString = re1.exec(showtime)[0].substring(2,re1.exec(showtime)[0].length-4);
      let monthName = dateString.substring(0,dateString.indexOf(' '));
      let monthNum = "";
      let date = "";
      let yearString = "";
      let dateObject = {};

      //Get info
      let leftColumn = {};
      let rightColumn = {};
      let infoColumns = $('.col-xs-12.col-sm-6', allArticles[i]);
      if($(infoColumns[0]).html().trim().length > 0){
        leftColumn = infoColumns[0];
        let dirtyLink = $('noscript', leftColumn).text()
        ticketLink = dirtyLink.substring(dirtyLink.indexOf('href="')+6, dirtyLink.indexOf("rel=")-2);
        if($(infoColumns[1]).html().trim().length > 1){
          rightColumn = infoColumns[1];
        }
      }
      

      try {
        monthNum = monthNameToNum(monthName); //Give this an error checker
        date = dateString.substring(dateString.indexOf(' ')+1);
        yearString = showtime.substring(showtime.length-4,showtime.length)
        //Build date object
        dateObject = new Date(monthNum+"-"+date+"-"+yearString);
      }
      catch(error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
      }
      
      //Build the show object
      console.log(i+".) "+allArticles[i].attribs.id);
      show.showtime = dateObject;
      show.artist = artist;
      show.venue = venue;
      show.ticketLink = ticketLink;
      showList.push(show);
    }

    //console.log(showList);
  })
  .catch(function(err) {
    //handle error
    console.log(err);
  });

var months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September',
    'October', 'November', 'December'
    ];

function monthNumToName(monthnum) {
    return months[monthnum - 1] || '';
}
function monthNameToNum(monthname) {
    var month = months.indexOf(monthname);
    return month ? month + 1 : 0;
}

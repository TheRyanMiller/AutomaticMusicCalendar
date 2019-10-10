const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://charlestonpourhouse.com/';
const moment = require('moment');

module.exports = new Promise(function(resolve, reject){
  rp(url).then(function(html) {
    const showArticles = [];
    let allArticles = $('article', html);
    let wrapper = [];
    let showHeaders = [];

    //Get all headers
    showHeaders = $('header.show-header', html); 
    //console.log(showHeaders.length);

    let eventList = [];
    let showtime = "";
    let artist = "";
    let venue = "";
    let cover = "?";
    let doorsTime = "";
    let showTime = "";
    let fbLink = "";
    let infoLink = "";
    let ticketLink = "";
    let event = {};

    //for (let i = 0; i < allArticles.length; i++) {
    for (let i = 0; i < allArticles.length; i++) {
      event = {};
      let artistsArr = [];
      $('h3', allArticles[i]).each(function(i, elem) {
        artistsArr[i] = $(this).text();
      });
      artist = artistsArr.join(", ");//$('h3', allArticles[i]).contents();
      venue = $('h2', allArticles[i]).text();
      //Handle Date
      dateStr = $('.show-day', allArticles[i]).text();
      let newItem;
      let da=[];
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
      let eventDate = new Date(moment(da[3]+"-"+da[1]+"-"+da[2], 'YYYY-MMMM-DD'));

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
      
      event.eventDate = eventDate;
      event.title = artist;
      event.location = "The Pour House";
      event.stage = venue;
      event.ticketLink = ticketLink;
      event.locAcronym = "ph";
      eventList.push(event);
    }
    resolve(eventList);
  })
  .catch(function(err) {
    //handle error
    console.log(err);
  });
});
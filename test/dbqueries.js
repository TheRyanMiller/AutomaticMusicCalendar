const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Event = require('../schemas/event');
const User = require('../schemas/user');
const path = require("path");
require('dotenv').config()
const ScrapeLog = require('../schemas/scrapeLog');

// connects our back end code with the database
let dbString = 
    process.env.MONGODB_CXN || 
    process.env.MONGO_URL_DEV;
mongoose.connect(dbString, { useNewUrlParser: true });
let db = mongoose.connection;
db.once('open', () => console.log('connected to the database... '+ dbString));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




/*
        Queries

let uid = "5d9729821ba646001730ae1a";
let query = {_id:uid};
User.findOne(
    query,{"_id":0},
    (err, data) => {
        if (err) return err;
        query = {_id: {$in : data.rsvpdEventIds} };
        Event.find(
            query,
            (err, data) => {
              if (err) return err;
              //console.log(data);
              return data;  
        })        
    }
)

/*
    Find Events    

let targetDate = new Date(new Date().setDate(new Date().getDate()-1));
Event.find(
    {eventDate: {$gt: targetDate}},
    (err, data) => {
      if (err) console.log(err);
      return console.log(data);
  })
  .sort({ "eventDate": 1 }, );
*/

/*
  Update user to admin


User.updateMany(
    {}, //query
    //{uid: "HHnkhlMuh7gFisPX6leWKURJBDS2"}, //query
    { $set: //update values
        {
            "isAdmin": true,
            "MAGA":{"maga":"we are", "having":"agoodtime"}
        }
    },
    {multi: true},
    (err, data) => {
        if (err) console.log(data)
        return console.log(data)
    }
)

User.find(
    {}, //query
    //{uid: "HHnkhlMuh7gFisPX6leWKURJBDS2"}, //query
    (err, data) => {
        if (err) console.log(data)
        return console.log(data)
    }
)



    
    Event.find(
        {eventDate: {$gt: targetDate}},
        (err, data) => {
        if (err) console.log(err);
        return console.log(data);
    })
    .sort({ "eventDate": 1 }, );
*/
let targetDate = new Date(new Date().setDate(new Date().getDate()-1));
targetDate = new Date("2019-10-26T02:50:25.135+00:00");
  ScrapeLog.deleteMany(
    {scrapeDate: {$lt: targetDate}},
    (err, data) => {
      if (err) console.log(err);
      return console.log(data);
  })
  .sort({ "eventDate": 1 }, );


  /* SCRAPE LOG STUFF
    ScrapeLog.find(
        (err, data) => {
        if (err) return console.log(err)
        return console.log(data)
    })
    .sort({'scrapeDate': -1}).limit(1);

    /*
    ScrapeLog.deleteMany({},(r)=>{
        console.log(r)
    })
  */
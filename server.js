const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Event = require('./schemas/event');
const User = require('./schemas/user');
const path = require("path");
const ScrapeLog = require('./schemas/scrapeLog');
require('dotenv').config();


const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// connects our back end code with the database
let dbString = process.env.MONGO_PROD_URL|| process.env.MONGO_URL_DEV;
mongoose.connect(dbString, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database... '+ dbString));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// USE middleware are executed every time a request is receieved
// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, "client", "build")));

// this is our get method
// this method fetches all available data in our database
router.get('/getEvents', (req, res) => {
    //Check if this is for a specfict user
    if(req.query.uid){
      let query = {_id:req.query.uid};
      User.findOne(
        query,{"_id":0},
        (err, data) => {
            if (err) return res.json({ success: false, error: err })
            if(data && data.rsvpdEventIds){
              query = {_id: {$in : data.rsvpdEventIds} };
              Event.find(
                  query,
                  (err, data) => {
                    if (err) return res.json({ success: false, error: err })
                    return res.json({ success: true, data: data });
              })
            }
            else{
              return res.json({ success: true, data: data });
            }
        }
      )
      .sort({ "eventDate": -1 });
    }
    //Get All Events (not just for one user)
    else{
      let targetDate = new Date(new Date().setDate(new Date().getDate()-1));
      Event.find(
        {eventDate: {$gt: targetDate}},
        (err, data) => {
          if (err) return res.json({ success: false, error: err });
          return res.json({ success: true, data: data})
      })
      .sort({ "eventDate": 1 }, );
    }
});

router.get('/getEvent', (req, res) => {
  let eid = req.query.eventId;
  let query = {_id: eid}
  Event.findOne(
    query,
    (err, data) => {
      if (err) return res.json({ success: false, error: err });
      console.log("DATA BABY  ",data)
      return res.json({ success: true, data: data })
  })
});

router.get('/getUsers', (req, res) => {
  User.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data })
  })
});

router.get('/getUserById', (req, res) => {
  User.find({_id:""},(err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data })
  })
});

router.post('/refreshEvents', (req, res) => {
  require('./databaseAdapters/scraper')()
    .then(function(scrapeLog){
      return res.json({ success: true, data: scrapeLog });
    })
    .catch(function(err){
      console.log(err);
      return res.json({ success: false, error: err });
    });
});

router.post('/checkUser', (req, res) => {
  let user = req.body.user;
  let query = { uid : user.uid};
  let setValues = { 
    lastLoggedIn: new Date()
  }

  User.countDocuments(query,(err,count) => {
    if(count>0){
      //User is found, now get their data
      User.findOneAndUpdate( 
        query, {$set: setValues}, {useFindAndModify:false}, (err, data) => {
          if (err) return res.json({ success: false, error: err 
        });
        return res.json({ success: true, data: data });
      }); 
    }
    else{
      user = new User(req.body.user);
      user.lastLoggedIn = new Date();
      user.save(
        (err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
      });
    }
  })
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateEvent', (req, res) => {
  const { id, update } = req.body;
  Event.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteEvent', (req, res) => {
  const { id } = req.body;
  Event.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/addEvent', (req, res) => {
  let event = new Event(req.body);
  //Must use Mongoose ObjectID type to convert string to an acceptable _id data type
  event._id = mongoose.Types.ObjectId(event._id);
  if ((!event._id && event._id !== 0)) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  event.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post('/addRsvp', (req, res) => {
  const { userId, eventId } = req.body;
  if (!eventId || !userId) {
    return res.json({
      success: false,
      error: 'Missing Inputs!',
    });
  }
  let userObjId = mongoose.Types.ObjectId(userId);
  User.countDocuments({ _id: userId },(err,count) => {
    if(count>0){
      User.findByIdAndUpdate( { _id : userObjId }, { $push: { rsvpdEventIds : eventId }}, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
      });
    }
    else{
      console.log("No user found for RsvpAdd")
    }
  })
});

router.post('/removeRsvp', (req, res) => {
  const { userId, eventId } = req.body;
  if (!eventId || !userId) {
    return res.json({
      success: false,
      error: 'Missing Inputs!',
    });
  }
  let userObjId = mongoose.Types.ObjectId(userId);
  User.countDocuments({ _id: userId },(err,count) => {
    if(count>0){
      User.findByIdAndUpdate( { _id : userObjId }, { $pull: { rsvpdEventIds : eventId }}, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
      });
    }
    else{
      console.log("No user found for RsvpAdd")
    }
  })
  
});

router.get('/getScrapeData', (req, res) => {
  query = {};
  ScrapeLog.find(
    query
    ,(err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data })
  }).sort({'scrapeDate': -1}).limit(1);
});

router.post('/upvote', (req, res) => {
  if(req.query.uid && req.query.eid){
    let eventId = req.query.eid;
    let userId = req.query.uid;
    let action = {};
    if(req.query.remove === "true"){
      
      action = { $pull: { upvotes: userId } };
    }
    else{
      action = { $push: { upvotes: userId } };
    }
    console.log(userId,eventId)
    let query = {_id:eventId};
    Event.updateOne(
      query,
      action,
      (err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
  }
  else{
    res.json({ success: false, error: "Invalid inputs" });
  }
  
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(process.env.PORT || process.env.API_PORT, () => console.log(`LISTENING ON PORT ${process.env.PORT || process.env.API_PORT}`));
const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Event = require('./schemas/event');
const User = require('./schemas/user');
const path = require("path");

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbName = 'chslivemusic';

// connects our back end code with the database
mongoose.connect(process.env.MONGODB_CXN || process.env.MONGO_URL_DEV, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

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
    Event.find(
      {eventDate: {$gt: new Date(new Date() - 1)}},
      (err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
    .sort({ "eventDate": 1 }, );
});

router.get('/getUsers', (req, res) => {
  User.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data })
  })
});

router.get('/getUserById', (req, res) => {
  let uid = req.body;
  User.find({_id:""},(err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data })
  })
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
  console.log(event.toString());
  console.log(event);
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
    
    console.log(event.title);
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
  console.log("---------------------");
  console.log(userObjId);
  console.log(eventId);
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
  console.log("---------------------");
  console.log(userObjId);
  console.log(eventId);
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

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(process.env.PORT || process.env.API_PORT, () => console.log(`LISTENING ON PORT ${process.env.PORT || process.env.API_PORT}`));
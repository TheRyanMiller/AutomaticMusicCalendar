const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Event = require('../schemas/event');
const User = require('../schemas/user');
const path = require("path");
require('dotenv').config()


// connects our back end code with the database
let dbString = process.env.MONGODB_CXN || process.env.MONGO_URL_DEV;
dbString="mongodb+srv://ryan:ryan@cluster0-r2ipi.mongodb.net/chslivemusic?retryWrites=true&w=majority";
mongoose.connect(dbString, { useNewUrlParser: true });
let db = mongoose.connection;
db.once('open', () => console.log('connected to the database... '+ dbString));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




/*
        Queries
*/
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
              console.log(data);
              return data;  
        })

        
    }
)

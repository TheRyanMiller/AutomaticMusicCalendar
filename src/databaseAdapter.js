const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let webEvents = [];


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'chslivemusic';

// Create a new MongoClient
const client = new MongoClient(url,{useNewUrlParser: true } );

let tinRoofEvents = require('./scrapers/tinRoofScraper.js').then(function(webEvents) {
    client.connect(function(err) {
        assert.equal(null, err); //Ensure we have a connection
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        searchEvent(db, "Tin Roof - Charleston", function(mongoEvents){
            //do something with the output
            let adminReview = [];
            let updateGroup = [];
            //Here I want to iterate through
            

            let insertGroup = mongoEvents.map(function(res){
                for(let i=0;i<webEvents.length;i++){
                    /* console.log(res.eventDate);
                    console.log(new Date(webEvents[i].eventDate));
                    console.log("*********"); */
                    //console.log(res.eventDate, "mongo");
                    let webDate = new Date(webEvents[i].eventDate).setHours(0,0,0,0);
                    let newWebDate = new Date(webDate).setHours(0,0,0,0);
                    console.log(new Date(new Date(webEvents[i].eventDate).setHours(0,0,0,0)).getTimezoneOffset(), "web");
                    if(res.title == webEvents[i].title && res.eventDate == new Date(webEvents[i].eventDate) ){
                        updateGroup.push(webEvents[i])
                        break;
                    }
                    else if (i == webEvents.length-1){
                        /* console.log(webEvents[i].title);
                        console.log(res.title);
                        console.log("-------------------");
                        return webEvents[i]; */
                    }
                }
                
            })
            console.log(insertGroup.length);
            console.log(updateGroup.length);

            /* if(mongoEvent.length>0){
                updateEvent(db, webEvents[i], mongoEvent, function(result){
                    console.log("Event Modified");
                });
            }
            else{
                insertOneEvent(db, webEvents[i], function(){
                    console.log("NEW EVENT INSERTED");
                })
            } */
        });
        
    });
    
  }, function(err) {
    console.log("didn't work");
    console.log(err); // Error: "It broke"
});





const insertEvents = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('events');
    // Insert some documents
    collection.insertMany(
        eventList, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted "+eventList.length+" documents into the collection");
        callback(result);
    });
}

const insertOneEvent = function(db, event, callback) {
    // Get the documents collection
    const collection = db.collection('events');
    // Insert some documents
    collection.insertOne(event, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
}


const searchEvent = function(db, location, callback){
    const collection = db.collection('events');
    //console.log(webEvent.title);
    let query = { eventDate: { $gte: new Date() } };
    collection.find(query).toArray(function(err, result){
        if(err) throw err;
        callback(result);
    });
    
};

const updateEvent = function(db, webEvent, mongoEvent, callback) {
    // Get the documents collection
    const collection = db.collection('events');
    // Insert some documents
    let query = { "_id": mongoEvent._id };
    collection.update(
        query,
        { webEvent },
        { upsert: false }, //options
        function(err, result) {
            if(err){
                console.log("======HERE IT IS====")
                console.log(mongoEvent)
                console.log("====================")
            }
            assert.equal(err, null);
            callback(result);
        }
        
    )
}



const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let webEvents = [];


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'chslivemusic';

// Create a new MongoClient
const client = new MongoClient(url,{useNewUrlParser: true } );

let tinRoofEvents = require('./scrapers/tinRoofScraper.js').then(function(result) {
    webEvents = result; //Populated event array
    client.connect(function(err) {
        assert.equal(null, err); //Ensure we have a connection
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        for(let i=0;i<webEvents.length;i++){
            searchEvent(db, webEvents[i], function(result){
                //do something with the output
                let mongoEvent = result;
                if(mongoEvent.length>0){
                    updateEvent(db, webEvents[i], mongoEvent, function(result){
                        console.log("Event Modified");
                    });
                }
                else{
                    insertOneEvent(db, webEvents[i], function(){
                        console.log("NEW EVENT INSERTED");
                    })
                }
            });
        }
        
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


const searchEvent = function(db, webEvent, callback){
    const collection = db.collection('events');
    //console.log(webEvent.title);
    let query = {title: webEvent.title, eventDate: webEvent.eventDate};
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



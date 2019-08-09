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
            //console.log(webEvents[i]);
            //search for this event in database
            searchEvent(db, webEvents[i]);
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

const searchEvent = function(db, webEvent){
    const collection = db.collection('events');
    //console.log(webEvent.title);
    let query = {title: webEvent.title}
    let count;
    let resultCount = collection.find(query).count(function(err, result){
        if(err) throw err;
        //Found it! Now let's replace

        //console.log("COUNT: "+result);
    });
    collection.find(query).toArray(function(err, result){
        if(err) throw err;
        //Found it! Now let's replace

        console.log(webEvent.title+" "+result.length);
    });
}



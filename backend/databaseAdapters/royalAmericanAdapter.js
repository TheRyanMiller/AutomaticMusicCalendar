const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
let webEvents = [];


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'chslivemusic';

// Create a new MongoClient
const client = new MongoClient(url,{useNewUrlParser: true } );

let royalEvents = require('../scrapers/royalScraper.js').then(function(rawWebEvents) {
    //Only match events in future
    let webEvents = rawWebEvents.filter(function(ev){
        return ev.eventDate.getTime() >= new Date().getTime();
    })
    //console.log(webEvents)
    client.connect(function(err) {
        assert.equal(null, err); //Ensure we have a connection
        console.log("Connected successfully to Mongo server");
        const db = client.db(dbName);
        let loc = "The Royal American"
        searchEvent(db, loc, function(mongoEvents){
            //do something with the output
            let adminReview = [];
            let updateGroup = [];
            let insertGroup = [];

            insertGroup = webEvents.filter(function(webEv){
                //
                let filterFlag = false;
                //Inner loop thru database events
                for(let i=0;i<mongoEvents.length;i++){
                    //Check for a match between db events
                    if(mongoEvents[i].title == webEv.title && mongoEvents[i].eventDate.getTime() == webEv.eventDate.getTime() ){
                        webEv._id = mongoEvents[i]._id;
                        updateGroup.push(webEv);
                        filterFlag = true;
                        break;
                    }
                }
                //Do some work on the _id value
                let dt = webEv.eventDate;
                let dtCode = dt.getMonth()+""+dt.getDate()+""+dt.getFullYear();
                let venueCode = "ra";
                let bandCode = webEv.title.replace(/\s/g, '').replace(/[^0-9a-z]/gi, '').substr(0,5).toLowerCase();
                let newId = bandCode+dtCode+venueCode;
                //webEv._id = ObjectID(newId);
                webEv._id = newId;
                //console.log("HI IM NOT PART OF THE DB YET!", newId);

                return !filterFlag;
            })
            if(insertGroup.length>0){
                insertEvents(db, insertGroup, function(){
                    //Do something post-insert
                });
            }
            if(updateGroup.length>0){
                for(let i=0;i<updateGroup.length;i++){
                    updateEvent(db, updateGroup[i], function(){
                        //do after update
                        
                    })
                }
                console.log("Congrats! "+updateGroup.length+" documents have been updated.");
            }
        });
        
    });
  }, function(err) {
    console.log("didn't work");
    console.log(err); // Error: "It broke"
});





const insertEvents = function(db, eventList, callback) {
    // Get the documents collection
    const collection = db.collection('events');
    // Insert some documents
    collection.insertMany(
        eventList, 
        function(err, result) {
            assert.equal(err, null);
            console.log("Inserted "+eventList.length+" documents into the collection");
            callback(result);
        }
    );
}

const searchEvent = function(db, location, callback){
    const collection = db.collection('events');
    //console.log(webEvent.title);
    let query = { eventDate: { $gte: new Date() }, location: location };
    collection.find(query).toArray(function(err, result){
        if(err) throw err;
        console.log("SEARCH RESULTS: "+result.length);
        callback(result);
    });
    
};

const updateEvent = function(db, event, callback) {
    // Get the documents collection
    const collection = db.collection('events');
    // Insert some documents
    let query = { "_id": event._id };
    collection.updateOne(
        query,
        { $set:
            {
                time: event.time,
                infoLink: event.infoLink,
                fee: event.fee,
                updateDate: new Date()
            } },
        { upsert: false }, //options
        function(err, result) {
            if(err){
            }
            assert.equal(err, null);
            callback(result);
        }
        
    )
}
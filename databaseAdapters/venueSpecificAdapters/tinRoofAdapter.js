const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
let webEvents = [];


// Connection URL
let url = process.env.MONGO_PROD_URL || 'mongodb://localhost:27017';


// Database Name
const dbName = 'chslivemusic';

// Create a new MongoClient
const client = new MongoClient(url,{useNewUrlParser: true } );

let tinRoofEvents = require('../../scrapers/tinRoofScraper.js').then(function(rawWebEvents) {
    //Only match events in future
    let webEvents = rawWebEvents.filter(function(ev){
        return ev.eventDate.getTime() >= new Date().getTime();
    })
    client.connect(function(err) {
        assert.equal(null, err); //Ensure we have a connection
        console.log("Connected successfully to Mongo server");
        const db = client.db(dbName);
        searchEvent(db, "Tin Roof - Charleston", function(mongoEvents){
            //do something with the output
            let adminReview = [];
            let updateGroup = [];
            let insertGroup = [];

            insertGroup = webEvents.filter(function(webEv){
                //console.log(res.title, res.eventDate, "mongo");
                let filterFlag = false;
                let dt = webEv.eventDate;
                let dtCode = dt.getMonth()+""+dt.getDate()+""+dt.getFullYear();
                let venueCode = "TR";
                let bandCode = webEv.title.replace(/\s/g, '').replace(/[^0-9a-z]/gi, '').substr(0,5).toLowerCase();
                let newId = bandCode+dtCode+venueCode;
                //webEv._id = ObjectID(newId);
                webEv._id = newId;
                for(let i=0;i<mongoEvents.length;i++){
                    if(webEv._id === mongoEvents[i]._id){
                        webEv._id = mongoEvents[i]._id;
                        updateGroup.push(webEv);
                        filterFlag = true;
                        break;
                    }
                }
                //Do some work on the _id value
                
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
        {ordered: false}, //this will cotinue if duplicates errors are found
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
    let query = { eventDate: { $gte: new Date() } };
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



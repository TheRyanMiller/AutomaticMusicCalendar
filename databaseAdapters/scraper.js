const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
var mongoUtil = require( './mongoUtil' );
let webEvents = [];


// Connection URL
let url = 'mongodb://localhost:27017';
url = "mongodb+srv://ryan:ryan@cluster0-r2ipi.mongodb.net/chslivemusic?retryWrites=true&w=majority";

let scrapeObs = [{
    locAcronym:"TR",
    location:"Tin Roof - Charleston",
    scraperFile:'../scrapers/tinRoofScraper.js'
},
{
    locAcronym:"MF",
    location:"The Music Farm - Charleston",
    scraperFile:'../scrapers/musicFarmScraper.js'
},
{
    locAcronym:"RA",
    location:"The Royal American",
    scraperFile:'../scrapers/royalScraper.js'
},
{
    locAcronym:"PH",
    location:"The Pour House",
    scraperFile:'../scrapers/pohoScraper.js'
}];
module.exports.myScraper = function(){
    mongoUtil.connectToServer(function(err,client){
        if (err) console.log(err);
        console.log("connected!!!!");
        let scrapeLog = {};
        let completedScrapes = 0;
        for(let i=0;i<scrapeObs.length;i++){
            require(scrapeObs[i].scraperFile).then(function(rawWebEvents) {
                //Only match events in future
                let webEvents = rawWebEvents.filter(function(ev){
                    return ev.eventDate.getTime() >= new Date().getTime();
                })
                let searchCount = 0;
                let updateCount = 0;
                let insertCount = 0;
                let webCount = webEvents.length;
                searchEvent(mongoUtil.getDb(), scrapeObs[i].location, function(mongoEvents){
                    searchCount = mongoEvents.length;
                    //do something with the output
                    let adminReview = [];
                    let updateGroup = [];
                    let insertGroup = [];

                    insertGroup = webEvents.filter(function(webEv){
                        let filterFlag = false;
                        let dt = webEv.eventDate;
                        let dtCode = dt.getMonth()+""+dt.getDate()+""+dt.getFullYear();
                        let venueCode = scrapeObs[i].locAcronym;
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
                        
                        return !filterFlag;
                    })
                    if(insertGroup.length>0){
                        insertEvents(mongoUtil.getDb(), insertGroup, function(){
                            //Do something post-insert
                        });
                        insertCount = insertGroup.length;
                    }
                    if(updateGroup.length>0){
                        for(let i=0;i<updateGroup.length;i++){
                            updateEvent(mongoUtil.getDb(), updateGroup[i], function(){
                                //do after update
                                
                            })
                        }
                        updateCount = updateGroup.length;
                    }
                    scrapeLog = {
                        "location":scrapeObs[i].location,
                        "insertCount":insertCount,
                        "updateCount":updateCount,
                        "searchCount":searchCount,
                        "webCount":webCount,
                        "scrapeDate": new Date()
                    }

                    insertScrapeLog(mongoUtil.getDb(),scrapeLog,function(result){
                        completedScrapes++;
                        if(result) console.log("Db sync "+ completedScrapes +"/"+scrapeObs.length+" successful "+scrapeObs[completedScrapes-1].locAcronym);
                        if(scrapeObs.length === completedScrapes){
                            console.log("Scrape logs written to database.")
                            mongoUtil.closeCxn();
                        }
                    })
                });
                
            });
        }
    })
}
const insertScrapeLog = function(db, log, callback) {
    // Get the documents collection
    const collection = db.collection('scrapelog');
    // Insert some documents
    collection.insertOne(
        log, 
        function(err, result) {
            assert.equal(err, null);
            callback(result);
        }
    );
}


const insertEvents = function(db, eventList, callback) {
    // Get the documents collection
    const collection = db.collection('events');
    // Insert some documents
    collection.insertMany(
        eventList, 
        {ordered: false}, //this will cotinue if duplicates errors are found
        function(err, result) {
            assert.equal(err, null);
            callback(result);
        }
    );
}

const searchEvent = function(db, location, callback){
    const collection = db.collection('events');
    let query = { eventDate: { $gte: new Date() }, location: location };
    collection.find(query).toArray(function(err, result){
        if(err) throw err;
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



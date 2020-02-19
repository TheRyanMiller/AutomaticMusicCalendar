const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
var mongoUtil = require( './mongoUtil' );
require('dotenv').config();

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

module.exports = () => new Promise(function(resolve, reject){
    mongoUtil.connectToServer(function(err,client){
        if (err) console.log(err);
        console.log("connected!!!!");
        let scrapeLog = {};
        let scrapeArr = [];
        let finalLog = {};
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
                    
                    //console.log(scrapeLog);
                    completedScrapes++;
                    scrapeArr.push(scrapeLog);
                    console.log("Db sync "+ completedScrapes +"/"+scrapeObs.length+" successful "+scrapeObs[completedScrapes-1].locAcronym);
                    if(scrapeObs.length === completedScrapes){
                        finalLog = compileLog(scrapeArr,mongoUtil.getDb(),function(log){
                            console.log("Scrape logs written to database if new shows detected.");
                            mongoUtil.closeCxn();
                            resolve(log);
                        });
                        
                    }
                });
                
            });
        }
    })
}
)

const compileLog = (scrapeArr, db, callback) =>{
    
    let result = {}; 
    result.scrapeDate = new Date();
    result.newEvents = 0;
    result.updatedEvents = 0;
    result.totalEvents = 0;
    result.venueLogs = scrapeArr;
    
    for(let i=0;i<scrapeArr.length;i++){
        result.newEvents += scrapeArr[i].insertCount;
        result.updatedEvents+= scrapeArr[i].updateCount;
        result.totalEvents += scrapeArr[i].searchCount;
        result.totalEvents += scrapeArr[i].insertCount;
    }
    
    let logNeeded = false;
    /*
        
        By default, logs are written only when new events 
        are found and added. Nevertheless, updates are still
        made to existing events with each scrape job (e.g. hourly),
        the updates just are not logged.
        Use this line below to determine when logs are written.

    */
    if(result.newEvents > 0) logNeeded = true;

    if(logNeeded){
        const log = db.collection('scrapelog');
        // Insert log
        log.insertOne(
            result, 
            function(err, res) {
                assert.equal(err, null);
                callback(result);
            }
        );
    }
    else{
        callback(result);
    }
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
    let targetDate = new Date(new Date().setDate(new Date().getDate()-1));
    let query = { eventDate: { $gte: targetDate }, location: location };
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
                title: event.title,
                time: event.time,
                infoLink: event.infoLink,
                fee: event.fee,
                showUrl: event.showUrl,
                location: event.location,
                doorsTime: event.doorsTime,
                showTime: event.showTime,
                locAcronym: event.locAcronym,
                ticketLink: event.ticketLink,
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



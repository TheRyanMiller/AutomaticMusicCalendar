const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//mongoose.set('debug', true);
//^^THIS command shows what mongoose is searching
mongoose.pluralize(null);

// this will be our data base's data structure 
let venueLog = new Schema({
  location: String,
  insertCount: Number,
  updateCount: Number,
  searchCount: Number,
  webCount: Number,
  scrapeDate: Date
});

const ScrapeLogSchema = new Schema(
  {
    scrapeDate: Date,
    newEvents: Number,
    updatedEvents: Number,
    totalEvents: Number,
    venueLogs: [venueLog]    
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("scrapelog", ScrapeLogSchema);

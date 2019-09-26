const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const EventSchema = new Schema(
  {
    _id: String,
    title: String,
    eventDate: Date,
    eventTime: String,
    infoLink: String,
    fee: String,
    location: String,
    message: String
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Event", EventSchema);

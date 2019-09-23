const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const UserSchema = new Schema(
  {
    name: String,
    email: String,
    age: Number,
    facebookId: String,
    googleId: String,
    pictureUrl: String,
    accessToken: String,
    lastLoggedIn: Date,
    rsvpdEventIds: [String]
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("User", UserSchema);

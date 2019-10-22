const MongoClient = require( 'mongodb' ).MongoClient;
require('dotenv').config()

let env = "Dev";
let url = process.env.MONGO_PROD_URL || 'mongodb://localhost:27017';
if(process.env.MONGO_PROD_URL) env = "Prod";
console.log("Connecting to: "+env)
var _db;
var mongoClient;

module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
      mongoClient = client;
      _db  = client.db('chslivemusic');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  },

  closeCxn: function() {
    mongoClient.close(function(){
        console.log("Closed MongoDB connection.")
    });
  }
};
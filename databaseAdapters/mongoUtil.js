const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb+srv://ryan:ryan@cluster0-r2ipi.mongodb.net/chslivemusic?retryWrites=true&w=majority";


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
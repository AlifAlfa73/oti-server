// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://alifalfa74:@oti12345-vhbeh.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const reference = require('./routes/route'); // Imports routes for the products
const port = 8765;

// Set up mongoose connection
const mongoose = require('mongoose');
const dev_uri = "mongodb+srv://bebek:bebekayam@oti-vhbeh.mongodb.net/test?retryWrites=true&w=majority";
let mongoDB = process.env.MONGODB_URI || dev_uri;
mongoose.connect(mongoDB,  { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Set up Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/reference', reference);
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
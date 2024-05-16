// import mongoose 
const mongoose = require('mongoose');
require('dotenv').config();

// Define URL to your mongoDb database

// const mongoURL = process.env.MONGO_URL_LOCAL
const mongoURL = process.env.MONGO_URL_ONLINE_ATLAS;

// Set up mongoDB connection
mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})


// Get the default connection object
// Mongoose maintains a default connection object representing the MongoDB connection 
const db = mongoose.connection;

//Define event listeners for database connection 

db.on('connected',()=>{
    console.log("Connected to MongoDB Server!!!");
});

db.on('error',(err)=>{
    console.log(" MongoDB Server connection error!!!", err);
});

db.on('disconnected',()=>{
    console.log("MongoDB Server disconnected!!!");
});

// Export the database connection 
module.exports = db;





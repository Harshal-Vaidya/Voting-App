const express = require('express');
const app = express();
const db = require('./db.js'); // This line is responsible for db connection
require('dotenv').config();
// const passport = require('./auth');


const port = process.env.PORT || 3000;

const {jwtAuthMiddleware} = require('./jwt.js');

// Importing body-parser and bodyParser.json() converts it into object and makes it available for request.body
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Import the router files
const userRoutes = require('./routes/userRoutes.js');
const candidateRoutes = require('./routes/candidateRoutes.js');

//Use the router files
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
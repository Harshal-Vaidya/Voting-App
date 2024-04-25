const express = require('express');
const app = express();


const port = 3000;

// Importing body-parser and bodyParser.json() converts it into object and makes it available for request.body
const bodyParser = require('body-parser');
app.use(bodyParser.json());



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
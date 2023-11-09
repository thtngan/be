const express = require("express");
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
require("dotenv").config();
var connectString = process.env.DATABASE_URL

mongoose.connect(connectString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
const router = require('./app/routes/api');
app.use(bodyParser.json());
app.use('/api', router)
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
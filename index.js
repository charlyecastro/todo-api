"use strict";

// Imports
const express = require('express');
const morgan = require("morgan");
const CircularJSON = require('circular-json')
const spreadsheet = require('./modules/spreadsheet-setup')
require('dotenv').config();


// instantiate app and use middlewares
const app = express();
app.use(morgan("dev"));

spreadsheet.connect()

app.get('/', function (req, res) {
    res.send('hello world')
})

app.get('/all', async function (req, res) {
    let rawRows = await spreadsheet.fetch();
    let cicularRows = CircularJSON.stringify(rawRows);
    let jsonRows = JSON.parse(cicularRows)
    res.json(jsonRows)
})

app.post('/data', function (req, res) {
    res.send('hello world')
})

app.delete('/data/:key', function (req, res) {
    res.send('hello world')
})

app.listen(process.env.PORT,() => {
    console.log("Server is running on port " + process.env.PORT); 
})
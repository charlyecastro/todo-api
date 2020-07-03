"use strict";

// Imports
const express = require('express');
const morgan = require("morgan");
const CircularJSON = require('circular-json')
const bodyParser = require('body-parser');
const spreadsheet = require('./modules/spreadsheet-setup')
require('dotenv').config();


// instantiate app and use middlewares
const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));

// connect to spreadsheet
spreadsheet.connect()

//
app.get('/', function (req, res) {
    res.send('hello world')
})

// returns all todo items from spreadsheet
app.get('/all', async function (req, res) {
    try {
        let rows = await spreadsheet.fetch();
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500);
        res.send("Something went wrong")
    }

})

// adds new todo item to spreadhsheet
app.post('/data', async function (req, res) {
    try {
        let key = Object.keys(req.body)[0]
        let val = req.body[key]
        let index = await containsKey(key)
        if (index !== -1) {
            await spreadsheet.edit(index, key, val)
            console.log("edited existing key value pair")
        } else {
            await spreadsheet.add(key, val);
            console.log("added new key value pair")
        }
        res.status(200);
        res.send("OK")
    } catch (err) {
        console.log(err)
        res.status(500);
        res.send("Something went wrong")
    }
})

// deletes todo item from spreadsheet
app.delete('/data/:key', function (req, res) {
    let key = req.params.key
    try {
        res.status(200);
        res.send("OK")

    } catch (err) {
        console.log(err)
        res.status(404);
        res.send("Key not found")
    }
})

// return index of existing key value pair otherwise return -1
async function containsKey(key){
    let rows = await spreadsheet.fetch();
    let index = -1;
    let filtered = rows.filter(row => {
        index++;
        return row[key] !== undefined
    })
    return filtered.length > 0 ? index : -1
}

app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
})
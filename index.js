"use strict";

// Imports
const express = require('express');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const spreadsheet = require('./modules/spreadsheet-setup')
require('dotenv').config();


// Instantiate app and use middlewares
const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));

// Connect to spreadsheet
spreadsheet.connect()

//
app.get('/', function (req, res) {
    res.send('hello world')
})

// Returns all key value pairs
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

// Adds new kay value pair
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

// Deletes existing key value pair 
app.delete('/data/:key', async function (req, res) {
    try {
        let key = req.params.key
        let index = await containsKey(key)
        if (index !== -1) {
            await spreadsheet.remove(index)
            res.status(200);
            res.send("OK");
        } else {
            res.status(404);
            res.send("Key not found");
        }
    } catch (err) {
        console.log(err)
        res.status(500);
        res.send("Something went wrong");
    }
})

// Return index of existing key value pair otherwise return -1
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
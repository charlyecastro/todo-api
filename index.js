// "use strict";

// Imports
const express = require('express');
const cors = require('cors')
const morgan = require("morgan");
const bodyParser = require('body-parser');
const spreadsheet = require('./modules/spreadsheet-setup')
require('dotenv').config();


// Instantiate app and use middlewares
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(morgan("dev"));

// Connect to spreadsheet
spreadsheet.connect()

// Base route sends Hello World
app.get('/', function (req, res) {
    res.status(200);
    res.send('hello world')
})

// Returns all key value pairs
app.get('/all', async function (req, res) {
    try {
        let rows = await spreadsheet.fetchJSON();
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500);
        res.send("Something went wrong")
    }
})

// Adds new kay value pair
app.post('/data', async function (req, res) {
    if (req.get('Content-Type') == 'application/json') {
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
    } else {
        console.log("Didn't set content type")
        res.status(415);
        res.send("Unsupported Media Type. Remember to set headers appropriately");
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
async function containsKey(key) {
    let rows = await spreadsheet.fetchRaw();
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let rowKey = row.Task.toLowerCase()
        if (rowKey == key.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
}) 
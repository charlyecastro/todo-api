"use strict";

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
        let response = {
            result: 200,
            data: rows
        }
        res.status(200);
        res.json(response);
    } catch (err) {
        console.log(err)
        res.status(500);
        res.json({
            result: 500,
            description: "Something went wrong"
        });
    }
})

// Adds new kay value pair
app.post('/data', async function (req, res) {
    if (req.get('Content-Type') != 'application/json') {
        res.status(415);
        res.json({
            result: 415,
            description: "Request header Content-Type must be application/json"
        });
    } else if (isEmpty(req.body)) {
        res.status(400);
        res.json({
            result: 400,
            description: "Request body can not be empty"
        });
    } else {
        try {
            let key = Object.keys(req.body)[0]
            let val = req.body[key]
            key = key.trim()
            let index = await containsKey(key)
            if (index !== -1) {
                await spreadsheet.edit(index, key, val)
                res.status(200);
                res.json({
                    result: 200,
                    description: "successfully updated key value pair"
                });
            } else {
                await spreadsheet.add(key, val);
                res.status(201);
                res.json({
                    result: 201,
                    description: "Successfully created new key-value pair"
                })
            }
        } catch (err) {
            console.log(err)
            res.status(500);
            res.json({
                result: 500,
                description: "Something went wrong"
            });
        }
    }
})

// Deletes existing key value pair 
app.delete('/data/:key', async function (req, res) {
    try {
        let key = req.params.key.trim()
        let index = await containsKey(key)
        if (index !== -1) {
            await spreadsheet.remove(index)
            res.status(200);
            res.json({
                result: 200,
                description: "Successfully deleted key-value pair"
            });
        } else {
            res.status(404);
            res.json({
                result: 404,
                description: "Key not found"
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500);
        res.json({
            result: 500,
            description: "Something went wrong"
        });
    }
})

// Return index of existing key value pair otherwise return -1
async function containsKey(key) {
    let rows = await spreadsheet.fetchRaw();
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let rowKey = row.Key.toLowerCase()
        if (rowKey == key.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

// Takes in an object and check if it is empty
function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return JSON.stringify(obj) === JSON.stringify({});
}

app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
}) 
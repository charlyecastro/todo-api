"use strict";

// Imports
const express = require('express');
const morgan = require("morgan");
require('dotenv').config();
const spreadsheet = require('./modules/spreadsheet-setup')

// instantiate app and use middlewares
const app = express();
app.use(morgan);

spreadsheet.connect()
spreadsheet.fetch()
let todo = { Task: 'Send email and attatch resume', Done: 'false' };
// spreadsheet.add(todo);
spreadsheet.edit(0, todo)
app.listen(process.env.PORT,() => {
    console.log("Server is running on port " + process.env.PORT); 
})
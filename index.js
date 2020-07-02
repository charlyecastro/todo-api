"use strict";

// Imports
const express = require('express');
const morgan = require("morgan");
require('dotenv').config();

// instantiate app and use middlewares
const app = express();
app.use(morgan);

app.listen(process.env.PORT,() => {
    console.log("Server is running on port " + process.env.PORT); 
})
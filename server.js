const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");
const apiController = require('./controllers/apiController.js');
const htmlController = require('./controllers/htmlController.js');
const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScrapesTheNews";

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use('/', htmlController);
app.use('/api', apiController);

app.listen(PORT, () => {
    console.log(`App running on port ${  PORT  }!`);
});
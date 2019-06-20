var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

var express = require("express");
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(process.cwd() + "/public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout:"main"}));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Latest-News-Scrape";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI)

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
    console.log("Connnected to  Mongoose...");
});

var routes = require("./controller/controller");

app.use("/", routes);

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on PORT " + port);
});

  
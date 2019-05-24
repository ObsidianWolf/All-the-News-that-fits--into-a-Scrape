var express = require("express");
var router = express.Router();
var path = require("path");

var axios = require("axios");
var cheerio = require("cheerio");

var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

router.get("/", function (req, res) {
    res.redirect("/articles");
});

router.get("/scrape", function (req, res) {
    axios.get("http://www.theverge.com" ).then(function (result) {
        var $ = cheerio.load(result.data);
        var titlesArray = [];

        $(".c-entry-box--compact__title").each(function (i, element) {
            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            if (result.title !== "" && result.link !== "") {
                if (titlesArray.indexOf(result.title) == -1) {
                    titlesArray.push(result.title);

                    Article.count({ title: result.title }, function (err, test) {
                        if (test === 0) {
                            var entry = new Article(result);

                            entry.save(function (err, doc) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            });
                        }
                    });

                } else {
                    console.log("Article already exist.");
                }
            } else {
                console.log("Not saved to DB, missing data");
            }

        });
        res.redirect("/");
    }).catch(err => {
        console.log(err);
    })
});
router.get("/articles", function (req, res) {
    Article.find().sort({ _id: -1 }).exec(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            var artcl = { article: doc };
            res.render("index", artcl);
        }
    });
});

//this gets the route scrapped from a mongo db into json
router.get("/articles-json", function(req, res){
    Article.find({}, function(err, doc){
     if(err){
         console.log(err);
     }else{
         res.json(doc);
     }   
    });
});

module.exports = router;
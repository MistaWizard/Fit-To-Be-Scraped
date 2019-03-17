// const db = require("../models");
const request = require("request");
const cheerio = require("cheerio");
const Article = require("../models/Article");
const Note = require("../models/Note");

module.exports = function(app) {
    app.get("/api/articles", function(req, res) {
        Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
    });
    app.get("/api/scrape", (req, res) => {
        request("https://www.comicbook.com/", (error, response, html) => {
            const $ = cheerio.load(html);
            console.log($("article").length);
            $("article").each(function(i, element) {
                let result = {};

                result.title = $(this).find("h3").find("a").text();
                result.link = $(this).find("h3").find("a").attr("href");
                result.photo = $(this).find("a").find("img").attr("src");
      
                Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
            });
        res.redirect("/");
        });
    });

    app.get("/api/notes", function(req, res) {
        Note.find({})
        .then(function(dbNote) {
            res.json(dbNote);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    app.get("/api/articles/:id", function(req, res) {
        Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    app.post("/api/articles/save/:id", function(req, res) {
        Article.findOneAndUpdate({ "_id": req.params.id}, {"saved": true})
        .then(function(dbArticle) {
            res.send(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
        res.redirect("/");
    });

    app.post("/api/articles/delete/:id", function(req, res) {
        Article.findOneAndUpdate({ _id: req.params.id}, {saved: false})
        .then(function(dbArticle) {
            res.redirect("/saved");
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    app.post("/api/notes/:id", (req, res) => {
        Note.create(req.body)
        .then(function(dbNote) {
            return Article.findOneAndUpdate({ _id: req.params.id }, { $push: { "notes": dbNote._id } }, {new: true});
        })
        .then(function(dbArticle) {
            res.redirect("/saved");
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    app.get("/api/clear", (req, res) => {
        Article.remove()
        .then(function() {
            res.json("documents removed from headline collection");
        });
    });

    app.post("/api/notes/delete/:id", (req, res) => {
        Note.deleteOne({ _id: req.params.id })
        .then(function(dbArticle) {
            res.redirect("/saved");
        })
        .then(function(result) {
            res.json(result);
        });
    });
}
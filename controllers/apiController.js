const db = require("../models");
const request = require("request");
const cheerio = require("cheerio");

module.exports = function(app) {
    app.get("/api/articles", function(req, res) {
        db.Article.find({})
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
      
                db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
            });
        res.send("Scrape Complete");
        });
    });
    app.get("/api/clear", function(req, res) {
        db.Article.remove()
        .then(function() {
            res.json("documents removed from headline collection")
        })
    });

    app.delete("/api/delete/notes/:id", function(req, res) {
        db.Note.remove(
            {_id: req.params.id}
        )
        .then(function(result) {
            res.json(result)
        })
    });
}
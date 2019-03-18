const db = require("../models");
const request = require("request");
const cheerio = require("cheerio");
const Article = require("../models/Article");
const Note = require("../models/Note");

module.exports = (app) => {
    app.get("/api/articles", (req, res) => {
        db.Article.find({})
        .then((dbArticle) =>
            res.json(dbArticle)
        )
        .catch((err) =>
            res.json(err)
        );
    });
    app.get("/api/scrape", (req, res) => {
        request("https://www.comicbook.com/", (error, response, html) => {
            const $ = cheerio.load(html);
            console.log($("article").length);
            $("article").each((i, element) => {
                let result = {};

                result.title = $(this).find("h3").find("a").text();
                result.link = $(this).find("h3").find("a").attr("href");
                result.photo = $(this).find("a").find("img").attr("src");
      
                db.Article.create(result)
                .then((dbArticle) =>
                    console.log(dbArticle)
                )
                .catch((err) =>
                    console.log(err)
                );
            });
        res.redirect("/");
        });
    });

    app.get("/api/notes", (req, res) => {
        db.Note.find({})
        .then((dbNote) =>
            res.json(dbNote)
        )
        .catch((err) =>
            res.json(err)
        );
    });

    app.get("/api/articles/:id", (req, res) => {
        db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then((dbArticle) =>
            res.json(dbArticle)
        )
        .catch((err) =>
            res.json(err)
        );
    });

    app.post("/api/articles/save/:id", (req, res) => {
        db.Article.findOneAndUpdate({ "_id": req.params.id}, {"saved": true})
        .then((dbArticle) =>
            res.send(dbArticle)
        )
        .catch((err) =>
            res.json(err)
        );
        res.redirect("/");
    });

    app.post("/api/articles/delete/:id", (req, res) => {
        db.Article.findOneAndUpdate({ _id: req.params.id}, {saved: false})
        .then((dbArticle) => {
            res.redirect("/saved");
        })
        .catch((err) => {
            res.json(err);
        });
    });

    app.post("/api/notes/:id", (req, res) => {
        db.Note.create(req.body)
        .then((dbNote) =>
            db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, {new: true})
        )
        .then((dbArticle) =>
            res.redirect("/saved")
        )
        .catch((err) =>
            res.json(err)
        );
    });

    app.get("/api/clear", (req, res) => {
        db.Article.remove()
        .then(() => {
            res.json("documents removed from collection");
        });
    });

    app.post("/api/notes/delete/:id", (req, res) => {
        db.Note.deleteOne({ _id: req.params.id })
        .then((dbNote) =>
            db.Article.findOneAndUpdate({ notes: req.params.id }, { $pull: { notes: req.params.id } }, {new: true})
        )
        .then((dbArticle) =>
            res.redirect("/saved")
        )
        .then((result) =>
            res.json(result)
        )
    });
}
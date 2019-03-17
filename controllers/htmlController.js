const db = require("../models");

module.exports = (app) => {
    app.get("/", (req, res) => {
        db.Article.find({"saved": false}).limit(20)
        .then((dbArticle) => {
            res.render("index", {data: dbArticle});
            console.log(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
    });

    app.get("/saved", (req, res) => {
        db.Article.find({"saved": true}).populate("notes", 'body')
        .then((dbArticle) => {
            res.render("saved", {article: dbArticle});
        })
        .catch((err) => {
            res.json(err);
        });
    });
}
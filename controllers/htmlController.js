const db = require("../models");

module.exports = (app) => {
    app.get("/", (req, res) => {
        db.Article.find({"saved": false}).sort({_id: 1}).limit(20)
        .then((dbArticle) =>
            res.render("index", {data: dbArticle})
        )
        .catch((err) =>
            res.json(err)
        );
    });

    app.get("/saved", (req, res) => {
        db.Article.find({"saved": true}).sort({_id: 1}).populate("notes", 'body')
        .then((dbArticle) =>
            res.render("saved", {article: dbArticle})
        )
        .catch((err) =>
            res.json(err)
        );
    });
}
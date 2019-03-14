const db = require("../models");

module.exports = function(app) {
    app.get("/", (req, res) => {
        db.Article.find({})
        .then((dbArticle) => {
            res.render("index", {data: dbArticle});
            console.log(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
    });
}
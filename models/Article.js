const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    index: { unique: true },
    required: true
  },
  link: {
    type: String,
    required: true
  },
  photo: {
    type: String,
  },
	saved: {
		type: Boolean,
		default: false
  },
  notes: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
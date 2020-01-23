const mongoose = require("mongoose");

const TitleSchema = new mongoose.Schema({
  creator_id: String,
  creator_name: String,
  title: String,
  description: String,
});

// compile model from schema
module.exports = mongoose.model("title", TitleSchema);
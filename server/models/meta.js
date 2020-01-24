const mongoose = require("mongoose");

const MetaSchema = new mongoose.Schema({
  creator_id: String,
  creator_name: String,
  title: String,
  description: String,
  type: String,
  timestamp: { type: Date, default: Date.now },
});

// compile model from schema
module.exports = mongoose.model("meta", MetaSchema);
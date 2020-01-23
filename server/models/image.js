const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  creator_id: String,
  creator_name: String,
  title: String,
  description: String,
  epochs: Number,
  batchSize: Number,
  classes: [String],
  images: mongoose.Schema.Types.Mixed, 
  timestamp: { type: Date, default: Date.now },
});

// compile model from schema
module.exports = mongoose.model("image", ImageSchema);
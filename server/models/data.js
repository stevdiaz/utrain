const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  creator_id: String,
  creator_name: String,
  title: String,
  description: String,
  epochs: Number,
  batchSize: Number,
  inputs: [String],
  outputs: [String],
  isRegression: Boolean,
  csv: String,
  fileName: String,
  timestamp: { type: Date, default: Date.now },
});

// compile model from schema
module.exports = mongoose.model("data", DataSchema);
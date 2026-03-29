// models/category.model.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
});

module.exports = mongoose.model("Category", categorySchema);
// models/product.model.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  category: String,
  rating: Number,
  sizes: [String],
  colors: [String],
  stock: Number,
  description: String,
  image: String,
});

module.exports = mongoose.model("Product", productSchema);
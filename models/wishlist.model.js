// models/wishlist.model.js
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  products: [String],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
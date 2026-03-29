// models/cart.model.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  items: [
    {
      productId: String,
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
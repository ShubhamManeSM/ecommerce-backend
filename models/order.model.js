// models/order.model.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: Array,
  totalAmount: Number,
  address: Object,
  status: {
    type: String,
    default: "Placed",
  },
});

module.exports = mongoose.model("Order", orderSchema);
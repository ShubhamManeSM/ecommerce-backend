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
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
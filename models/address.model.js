// models/address.model.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  city: String,
  state: String,
  pincode: String,
  addressLine: String,
});

module.exports = mongoose.model("Address", addressSchema);
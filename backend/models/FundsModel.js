const mongoose = require("mongoose");

const fundsSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 100000, // starting ₹1 lakh
  },
});

module.exports = { FundsModel: mongoose.model("Funds", fundsSchema) };
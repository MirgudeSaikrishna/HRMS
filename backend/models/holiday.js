const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
  title: String,
  date: Date,
  isOptional: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Holiday || mongoose.model("Holiday", holidaySchema);

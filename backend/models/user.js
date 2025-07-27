const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Employee', 'Manager', 'Admin'], default: 'Employee' },
  leaveQuota: {
    Sick: { type: Number, default: 5 },
    Casual: { type: Number, default: 5 },
    Vacation: { type: Number, default: 5 },
    lop: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

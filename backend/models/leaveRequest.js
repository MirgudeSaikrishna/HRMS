const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  leaveType: { type: String, enum: ['Sick', 'Casual', 'Vacation', 'Academic', 'WFH', 'CompOff'] },
  startDate: Date,
  endDate: Date,
  reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedAt: { type: Date, default: Date.now }
});

module.exports =mongoose.models.LeaveRequest || mongoose.model("LeaveRequest", leaveRequestSchema);


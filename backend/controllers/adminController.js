const User = require("../models/user");
const LeaveRequest = require("../models/leaveRequest");

// Get all users with quotas
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role leaveQuota");
    res.json({users:users});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a user's quota
exports.updateQuota = async (req, res) => {
  try {
    const { userId } = req.params;
    const { leaveQuota } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { leaveQuota },
      { new: true }
    );

    res.json({ message: "Quota updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find()
      .populate("userId", "name email")
      .sort({ appliedAt: -1 });

    res.status(200).json({ leaves: leaveRequests });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ message: "Server error while fetching leave requests" });
  }
};


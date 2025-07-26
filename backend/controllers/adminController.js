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


exports.updateLeaveStatus = async function (req, res) {
  try {
    const leaveId = req.params.id;
    const { status } = req.body; // Status will be "Approved" or "Rejected"

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    const leave = await LeaveRequest.findById(leaveId).populate("userId");
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    const user = leave.userId;
    const userRecord = await User.findById(user._id);

    // If Reject → No quota or LOP calculation required
    if (status === "Rejected") {
      leave.status = "Rejected";
      await leave.save();
      return res.json({ message: "Leave rejected successfully", leave });
    }

    // ✅ If Approve → Check Quotas & LOP
    const leaveType = leave.leaveType;
    const quota = userRecord.leaveQuota?.[leaveType] || 0;
    const lopUsed = userRecord.leaveQuota?.lop || 0;

    // Calculate number of leave days (inclusive)
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    const leaveDays =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Check LOP condition
    if (quota < leaveDays) {
      const lopRequired = leaveDays - quota;

      if (lopUsed + lopRequired > 10) {
        return res.status(400).json({
          message: "User exceeds maximum LOP days (10) for the year.",
        });
      }

      // Update LOP
      userRecord.leaveQuota.lop = lopUsed + lopRequired;
      userRecord.leaveQuota[leaveType] = 0; // All quota used
    } else {
      // Deduct from quota
      userRecord.leaveQuota[leaveType] = Math.max(0, quota - leaveDays);
    }

    // ✅ Approve the leave
    leave.status = "Approved";
    await userRecord.save();
    await leave.save();

    res.json({ message: "Leave approved successfully", leave, user: userRecord });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuota = async (req, res) => {
  try {
    const userId = req.params.id;
    const { leaveQuota } = req.body; // new quota value

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.leaveQuota.Casual = user.leaveQuota.Casual+Number(leaveQuota); // or update specific leave type as needed
    await user.save();

    res.json({ message: "Leave quota updated!", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
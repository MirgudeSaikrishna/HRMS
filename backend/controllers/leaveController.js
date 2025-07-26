const LeaveRequest = require("../models/leaveRequest");
const User = require("../models/user");
// const nodemailer = require("nodemailer");


exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const userId = req.user.id;

    // Check overlapping leaves
    const overlap = await LeaveRequest.findOne({
      userId,
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $lte: endDate, $gte: startDate } },
        {
          $and: [
            { startDate: { $lte: startDate } },
            { endDate: { $gte: endDate } },
          ],
        },
      ],
      status: { $ne: "Rejected" },
    });

    if (overlap) {
      return res.status(400).json({ message: "Overlapping leave exists" });
    }

    const leave = new LeaveRequest({
      userId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await leave.save();

    // const user = await User.findById(userId);
    // const manager = await User.findOne({ role: "Manager" });
    // if (manager && manager.email) {
    //   // Configure transporter (use your SMTP credentials)
    //   const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //       user: process.env.SMTP_USER, // your email
    //       pass: process.env.SMTP_PASS, // your app password
    //     },
    //   });

    //   const mailOptions = {
    //     from: process.env.SMTP_USER,
    //     to: manager.email,
    //     subject: "New Leave Application Submitted",
    //     html: `
    //       <p>Dear Manager,</p>
    //       <p>User <b>${user.name}</b> (${user.email}) has applied for leave:</p>
    //       <ul>
    //         <li><b>Type:</b> ${leaveType}</li>
    //         <li><b>From:</b> ${new Date(startDate).toLocaleDateString()}</li>
    //         <li><b>To:</b> ${new Date(endDate).toLocaleDateString()}</li>
    //         <li><b>Reason:</b> ${reason}</li>
    //       </ul>
    //       <p>Please review in the HRMS portal.</p>
    //     `,
    //   };

    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       console.error("Error sending mail to manager:", error);
    //     }
    //   });
    // }
    // --- End Email ---

    res.status(201).json({ message: "Leave applied", leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ...existing code...

// Get Logged-in User’s Leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ userId: req.user.id }).sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin/Manager - View all
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().populate("userId", "name email role").sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve or Reject Leave
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = status;
    await leave.save();

    res.json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel Leave (only by owner if pending)
exports.cancelLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await LeaveRequest.findById(id);

    if (!leave || leave.userId.toString() !== req.user.id || leave.status !== "Pending") {
      return res.status(403).json({ message: "Cannot cancel this leave" });
    }

    leave.status = "Cancelled";
    await leave.save();

    res.json({ message: "Leave cancelled", leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async(req,res)=>{
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json({ user });
}
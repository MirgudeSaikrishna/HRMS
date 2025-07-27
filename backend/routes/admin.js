const express = require("express");
const router = express.Router();
const { getUsers, updateQuota , getAllLeaveRequests,updateLeaveStatus} = require("../controllers/adminController");
const { verifyToken, restrictTo } = require("../middlewares/auth");

router.get("/users", verifyToken, getUsers);
router.get("/leaves",verifyToken, restrictTo("Manager"||"Admin"), getAllLeaveRequests)
router.patch("/leave/:id",verifyToken,restrictTo("Manager"||"Admin"),updateLeaveStatus);
module.exports = router;

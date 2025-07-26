const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  cancelLeave,
  getProfile
} = require("../controllers/leaveController");

const { verifyToken, restrictTo } = require("../middlewares/auth");

router.post("/apply", verifyToken, applyLeave);
router.get("/my", verifyToken, getMyLeaves);
router.get("/all", verifyToken, restrictTo("Manager", "Admin"), getAllLeaves);
router.patch("/status/:id", verifyToken, restrictTo("Manager", "Admin"), updateLeaveStatus);
router.patch("/cancel/:id", verifyToken, cancelLeave);
router.get("/mine",verifyToken,getProfile);

module.exports = router;

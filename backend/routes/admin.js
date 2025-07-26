const express = require("express");
const router = express.Router();
const { getUsers, updateQuota , getAllLeaveRequests} = require("../controllers/adminController");
const { verifyToken, restrictTo } = require("../middlewares/auth");

router.get("/users", verifyToken, restrictTo("Admin"), getUsers);
router.get("/leaves",verifyToken, restrictTo("Admin"), getAllLeaveRequests)
router.put("/quota/:userId", verifyToken, restrictTo("Admin"), updateQuota);

module.exports = router;

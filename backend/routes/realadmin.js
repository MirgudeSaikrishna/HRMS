const express = require("express");
const router = express.Router();
const { updateQuota} = require("../controllers/adminController");
const { verifyToken, restrictTo } = require("../middlewares/auth");

router.put(
  "/users/:id/leave-quota",
  verifyToken,
  updateQuota
);
module.exports = router;

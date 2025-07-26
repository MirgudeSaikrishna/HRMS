const express = require("express");
const router = express.Router();
const { addHoliday, getHolidays, deleteHoliday } = require("../controllers/holidayController");
const { verifyToken, restrictTo } = require("../middlewares/auth");

router.post("/", verifyToken, restrictTo("Admin"), addHoliday);
router.get("/", verifyToken, getHolidays);
router.delete("/:id", verifyToken, restrictTo("Admin"), deleteHoliday);

module.exports = router;

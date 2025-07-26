const Holiday = require("../models/holiday");

// Add a holiday
exports.addHoliday = async (req, res) => {
  try {
    const { title, date, isOptional } = req.body;
    const holiday = new Holiday({ title, date, isOptional });
    await holiday.save();
    res.status(201).json({ message: "Holiday added", holiday });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all holidays
exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json(holidays);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a holiday
exports.deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    await Holiday.findByIdAndDelete(id);
    res.json({ message: "Holiday deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

// POST /api/appointments - create an appointment
router.post("/", async (req, res) => {
  try {
    const { title, date, time, duration, description, attendees } = req.body;

    if (!title || !date || !time || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const appointment = await Appointment.create({
      title,
      date,
      time,
      duration,
      description: description || "",
      attendees: Array.isArray(attendees) ? attendees : [],
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error("Create appointment error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/appointments - list appointments
router.get("/", async (req, res) => {
  try {
    const items = await Appointment.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("List appointments error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

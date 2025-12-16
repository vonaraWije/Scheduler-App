const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

// CREATE - Add new appointment
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

// READ ALL - Get all appointments
router.get("/", async (req, res) => {
  try {
    const items = await Appointment.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("List appointments error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// READ ONE - Get single appointment by ID
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.json({ data: appointment });
  } catch (err) {
    console.error("Get appointment error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE - Edit appointment by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, date, time, duration, description, attendees } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        title,
        date,
        time,
        duration,
        description,
        attendees
      },
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.json(appointment);
  } catch (err) {
    console.error("Update appointment error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE - Remove appointment by ID
router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Delete appointment error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

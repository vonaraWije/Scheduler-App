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

// DASHBOARD STATS - Get statistics for dashboard (MUST BE BEFORE /:id)
router.get("/stats/dashboard", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    
    // Total meetings
    const totalMeetings = appointments.length;
    
    // Average duration
    const avgDuration = appointments.length > 0
      ? Math.round(appointments.reduce((sum, apt) => sum + apt.duration, 0) / appointments.length)
      : 0;
    
    // Meetings per week (group by week)
    const weeklyData = {};
    appointments.forEach(apt => {
      const date = new Date(apt.date);
      const week = `Week ${Math.ceil(date.getDate() / 7)}`;
      weeklyData[week] = (weeklyData[week] || 0) + 1;
    });
    
    // Most busy day
    const dayCount = {};
    appointments.forEach(apt => {
      const date = new Date(apt.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      dayCount[dayName] = (dayCount[dayName] || 0) + 1;
    });
    
    const busiestDay = Object.keys(dayCount).length > 0
      ? Object.keys(dayCount).reduce((a, b) => dayCount[a] > dayCount[b] ? a : b)
      : "No data";
    
    // Duration distribution for chart
    const durationRanges = {
      "0-30 min": 0,
      "31-60 min": 0,
      "61-90 min": 0,
      "90+ min": 0
    };
    
    appointments.forEach(apt => {
      if (apt.duration <= 30) durationRanges["0-30 min"]++;
      else if (apt.duration <= 60) durationRanges["31-60 min"]++;
      else if (apt.duration <= 90) durationRanges["61-90 min"]++;
      else durationRanges["90+ min"]++;
    });
    
    res.json({
      totalMeetings,
      avgDuration,
      busiestDay,
      busiestDayCount: dayCount[busiestDay] || 0,
      weeklyData: Object.keys(weeklyData).map(week => ({
        week,
        meetings: weeklyData[week]
      })),
      dayDistribution: Object.keys(dayCount).map(day => ({
        day,
        count: dayCount[day]
      })),
      durationDistribution: Object.keys(durationRanges).map(range => ({
        range,
        count: durationRanges[range]
      }))
    });
  } catch (err) {
    console.error("Dashboard stats error", err);
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

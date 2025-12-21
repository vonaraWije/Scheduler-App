const express = require("express");
const Appointment = require("../models/Appointment");
const aiParser = require("../services/aiParser");
const conflictChecker = require("../services/ConflictChecker");

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

// ==================== AI ENDPOINTS ====================

// AI NATURAL LANGUAGE PARSER - Parse text like "meeting tomorrow at 2pm"
router.post("/ai/parse-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text input is required" });
    }

    // Parse natural language using AI service
    const parsed = aiParser.parseNaturalLanguage(text);

    if (!parsed.success) {
      return res.status(400).json({ 
        success: false,
        message: "Could not understand the input",
        parsed 
      });
    }

    // Check if the parsed appointment has conflicts
    const existingAppointments = await Appointment.find({ date: parsed.date }).sort({ time: 1 });
    const conflicts = aiParser.findConflicts(
      existingAppointments,
      parsed.time,
      parsed.duration
    );

    res.json({
      success: true,
      parsed,
      hasConflicts: conflicts.length > 0,
      conflicts,
      message: conflicts.length > 0 
        ? `⚠️ Found ${conflicts.length} conflict(s) at this time` 
        : '✅ Time slot is available!'
    });
  } catch (err) {
    console.error("Parse text error", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// AI SMART SCHEDULING - Find available slots between 9 AM - 5 PM
router.post("/ai/smart-schedule", async (req, res) => {
  try {
    const { date, duration = 30, preferredStartTime = "09:00", preferredEndTime = "17:00" } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const existingAppointments = await Appointment.find({ date }).sort({ time: 1 });

    // Use AI Parser service to find available slots (9 AM - 5 PM)
    const availableSlots = aiParser.findAvailableSlots(
      existingAppointments,
      duration,
      preferredStartTime,
      preferredEndTime
    );

    // Get the best slot using AI scoring
    const bestSlot = aiParser.getBestSlot(availableSlots);

    res.json({
      success: true,
      hasAvailableSlots: availableSlots.length > 0,
      recommendedSlot: bestSlot,
      allAvailableSlots: availableSlots,
      totalSlotsFound: availableSlots.length,
      message: availableSlots.length > 0
        ? `Found ${availableSlots.length} available slot(s)`
        : 'No available slots found for this date'
    });
  } catch (err) {
    console.error("Smart schedule error", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// AI CONFLICT CHECKER - Check if a specific time has conflicts
router.post("/ai/check-conflict", async (req, res) => {
  try {
    const { date, time, duration, excludeId } = req.body;

    if (!date || !time || !duration) {
      return res.status(400).json({ message: "Date, time, and duration are required" });
    }

    // Get all appointments for that date
    let existingAppointments = await Appointment.find({ date }).sort({ time: 1 });

    // Check for conflicts
    const conflictResult = conflictChecker.checkAppointmentConflict(
      existingAppointments,
      { time, duration },
      excludeId
    );

    // Validate timing (business hours, duration, etc.)
    const timingValidation = conflictChecker.validateAppointmentTiming({ date, time, duration });

    // Find back-to-back meetings
    const backToBack = conflictChecker.findBackToBackMeetings(
      existingAppointments,
      time,
      duration
    );

    res.json({
      hasConflict: conflictResult.hasConflict,
      conflicts: conflictResult.conflicts,
      severity: conflictResult.severity,
      timingIssues: timingValidation,
      backToBackMeetings: backToBack,
      message: conflictResult.hasConflict
        ? `Conflicts with ${conflictResult.conflicts.length} existing appointment(s)`
        : 'Time slot is available'
    });
  } catch (err) {
    console.error("Conflict check error", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

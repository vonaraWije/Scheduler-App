const Appointment = require("../models/Appointment");

// Create appointment
exports.createAppointment = async (req, res) => {
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

    res.status(201).json({ message: "Appointment created", data: appointment });
  } catch (err) {
    console.error("Create appointment error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.json({ message: "Appointments retrieved", data: appointments });
  } catch (err) {
    console.error("Get appointments error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single appointment
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment retrieved", data: appointment });
  } catch (err) {
    console.error("Get appointment error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, time, duration, description, attendees } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        title,
        date,
        time,
        duration,
        description,
        attendees: Array.isArray(attendees) ? attendees : [],
      },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment updated", data: appointment });
  } catch (err) {
    console.error("Update appointment error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted", data: appointment });
  } catch (err) {
    console.error("Delete appointment error", err);
    res.status(500).json({ message: "Server error" });
  }
};

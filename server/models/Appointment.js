const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    duration: { type: Number, required: true, min: 1 }, // minutes
    description: { type: String, default: "" },
    attendees: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);

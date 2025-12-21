// Conflict Checker Service - Validates appointments and detects scheduling conflicts
// This service provides conflict detection logic for the scheduling system

const { timeToMinutes, hasTimeOverlap } = require('./aiParser');

/**
 * Check if a specific appointment time has conflicts
 * @param {Array} existingAppointments - Array of appointments to check against
 * @param {Object} newAppointment - New appointment to validate {time, duration}
 * @param {string} excludeId - Optional ID to exclude (for updates)
 * @returns {Object} Conflict check result
 */
function checkAppointmentConflict(existingAppointments, newAppointment, excludeId = null) {
  const { time, duration } = newAppointment;
  
  const newStartMins = timeToMinutes(time);
  const newEndMins = newStartMins + parseInt(duration);
  
  const conflicts = [];
  
  for (const apt of existingAppointments) {
    // Skip if this is the appointment being updated
    if (excludeId && apt._id.toString() === excludeId) {
      continue;
    }
    
    const aptStartMins = timeToMinutes(apt.time);
    const aptEndMins = aptStartMins + apt.duration;
    
    if (hasTimeOverlap(newStartMins, newEndMins, aptStartMins, aptEndMins)) {
      conflicts.push({
        id: apt._id,
        title: apt.title,
        time: apt.time,
        duration: apt.duration,
        attendees: apt.attendees || [],
        description: apt.description || '',
        conflictType: determineConflictType(newStartMins, newEndMins, aptStartMins, aptEndMins)
      });
    }
  }
  
  return {
    hasConflict: conflicts.length > 0,
    conflictCount: conflicts.length,
    conflicts,
    severity: calculateConflictSeverity(conflicts)
  };
}

/**
 * Determine the type of conflict (full overlap, partial, etc.)
 * @param {number} start1 - First range start
 * @param {number} end1 - First range end
 * @param {number} start2 - Second range start
 * @param {number} end2 - Second range end
 * @returns {string} Conflict type
 */
function determineConflictType(start1, end1, start2, end2) {
  // Complete overlap - one completely contains the other
  if (start1 <= start2 && end1 >= end2) {
    return 'COMPLETE_OVERLAP';
  }
  if (start2 <= start1 && end2 >= end1) {
    return 'COMPLETE_OVERLAP';
  }
  
  // Partial overlap
  if (start1 < start2 && end1 > start2) {
    return 'PARTIAL_OVERLAP_END';
  }
  if (start1 < end2 && end1 > end2) {
    return 'PARTIAL_OVERLAP_START';
  }
  
  return 'UNKNOWN';
}

/**
 * Calculate severity of conflicts (low, medium, high)
 * @param {Array} conflicts - Array of conflicts
 * @returns {string} Severity level
 */
function calculateConflictSeverity(conflicts) {
  if (conflicts.length === 0) return 'NONE';
  if (conflicts.length === 1) return 'LOW';
  if (conflicts.length <= 3) return 'MEDIUM';
  return 'HIGH';
}

/**
 * Validate appointment timing rules
 * @param {Object} appointment - Appointment to validate {date, time, duration}
 * @returns {Object} Validation result
 */
function validateAppointmentTiming(appointment) {
  const errors = [];
  const warnings = [];
  
  const { date, time, duration } = appointment;
  
  // Check if duration is reasonable
  if (duration < 5) {
    errors.push('Meeting duration must be at least 5 minutes');
  }
  if (duration > 480) {
    warnings.push('Meeting duration exceeds 8 hours - consider splitting into multiple sessions');
  }
  
  // Check if time is within business hours (9 AM - 5 PM)
  const startMins = timeToMinutes(time);
  const endMins = startMins + duration;
  
  if (startMins < 9 * 60) {
    warnings.push('Meeting starts before 9 AM (outside standard business hours)');
  }
  if (endMins > 17 * 60) {
    warnings.push('Meeting ends after 5 PM (outside standard business hours)');
  }
  
  // Check if meeting is on a weekend
  const appointmentDate = new Date(date);
  const dayOfWeek = appointmentDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    warnings.push('Meeting scheduled on weekend');
  }
  
  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appointmentDate < today) {
    errors.push('Cannot schedule meetings in the past');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    hasWarnings: warnings.length > 0
  };
}

/**
 * Find back-to-back meetings (meetings with no gap between them)
 * @param {Array} existingAppointments - Array of appointments
 * @param {string} newTime - New appointment time
 * @param {number} newDuration - New appointment duration
 * @returns {Array} Array of back-to-back meetings
 */
function findBackToBackMeetings(existingAppointments, newTime, newDuration) {
  const newStartMins = timeToMinutes(newTime);
  const newEndMins = newStartMins + parseInt(newDuration);
  
  const backToBack = [];
  
  for (const apt of existingAppointments) {
    const aptStartMins = timeToMinutes(apt.time);
    const aptEndMins = aptStartMins + apt.duration;
    
    // Check if meetings are directly adjacent (no gap)
    if (aptEndMins === newStartMins || newEndMins === aptStartMins) {
      backToBack.push({
        id: apt._id,
        title: apt.title,
        time: apt.time,
        duration: apt.duration,
        position: aptEndMins === newStartMins ? 'BEFORE' : 'AFTER'
      });
    }
  }
  
  return backToBack;
}

/**
 * Calculate meeting load for a specific date
 * @param {Array} appointments - Appointments for the date
 * @returns {Object} Meeting load analysis
 */
function calculateMeetingLoad(appointments) {
  if (!appointments || appointments.length === 0) {
    return {
      totalMeetings: 0,
      totalMinutes: 0,
      totalHours: 0,
      loadPercentage: 0,
      density: 'LIGHT',
      recommendation: 'Good availability for scheduling'
    };
  }
  
  const totalMinutes = appointments.reduce((sum, apt) => sum + apt.duration, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  
  // Assume 8-hour work day (480 minutes)
  const workDayMinutes = 480;
  const loadPercentage = Math.round((totalMinutes / workDayMinutes) * 100);
  
  let density = 'LIGHT';
  let recommendation = 'Good availability for scheduling';
  
  if (loadPercentage > 80) {
    density = 'HEAVY';
    recommendation = 'Day is heavily booked - avoid scheduling more meetings';
  } else if (loadPercentage > 50) {
    density = 'MODERATE';
    recommendation = 'Day has moderate load - schedule carefully';
  }
  
  return {
    totalMeetings: appointments.length,
    totalMinutes,
    totalHours,
    loadPercentage,
    density,
    recommendation
  };
}

/**
 * Suggest break times between meetings
 * @param {Array} appointments - Sorted appointments
 * @returns {Array} Suggested break times
 */
function suggestBreaks(appointments) {
  if (!appointments || appointments.length < 2) {
    return [];
  }
  
  // Sort by time
  const sorted = [...appointments].sort((a, b) => {
    return timeToMinutes(a.time) - timeToMinutes(b.time);
  });
  
  const breaks = [];
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    
    const currentEnd = timeToMinutes(current.time) + current.duration;
    const nextStart = timeToMinutes(next.time);
    const gapMinutes = nextStart - currentEnd;
    
    // If gap is less than 10 minutes, suggest a break
    if (gapMinutes < 10 && gapMinutes >= 0) {
      breaks.push({
        after: current.title,
        before: next.title,
        currentGap: gapMinutes,
        suggestedGap: 10,
        reason: 'Short break recommended for focus and productivity'
      });
    }
  }
  
  return breaks;
}

module.exports = {
  checkAppointmentConflict,
  determineConflictType,
  calculateConflictSeverity,
  validateAppointmentTiming,
  findBackToBackMeetings,
  calculateMeetingLoad,
  suggestBreaks
};

// AI Parser Service - Intelligent time slot management and conflict detection
// This service handles the core AI logic for smart scheduling

/**
 * Convert time string (HH:MM) to minutes since midnight
 * @param {string} timeStr - Time in HH:MM format
 * @returns {number} Minutes since midnight
 */
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string (HH:MM)
 * @param {number} minutes - Minutes since midnight
 * @returns {string} Time in HH:MM format
 */
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Check if two time ranges overlap
 * @param {number} start1 - Start time in minutes
 * @param {number} end1 - End time in minutes
 * @param {number} start2 - Start time in minutes
 * @param {number} end2 - End time in minutes
 * @returns {boolean} True if times overlap
 */
function hasTimeOverlap(start1, end1, start2, end2) {
  return start1 < end2 && end1 > start2;
}

/**
 * Find all time slots that conflict with a given time range
 * @param {Array} appointments - Array of existing appointments
 * @param {string} targetTime - Target start time (HH:MM)
 * @param {number} targetDuration - Target duration in minutes
 * @returns {Array} Array of conflicting appointments
 */
function findConflicts(appointments, targetTime, targetDuration) {
  const targetStartMins = timeToMinutes(targetTime);
  const targetEndMins = targetStartMins + targetDuration;
  
  const conflicts = [];
  
  for (const apt of appointments) {
    const aptStartMins = timeToMinutes(apt.time);
    const aptEndMins = aptStartMins + apt.duration;
    
    if (hasTimeOverlap(targetStartMins, targetEndMins, aptStartMins, aptEndMins)) {
      conflicts.push({
        id: apt._id,
        title: apt.title,
        time: apt.time,
        duration: apt.duration,
        endTime: minutesToTime(aptEndMins),
        overlapMinutes: Math.min(targetEndMins, aptEndMins) - Math.max(targetStartMins, aptStartMins)
      });
    }
  }
  
  return conflicts;
}

/**
 * Find available time slots within a given time range (9 AM - 5 PM default)
 * @param {Array} appointments - Existing appointments
 * @param {number} duration - Desired duration in minutes
 * @param {string} startTime - Working day start time (default: 09:00)
 * @param {string} endTime - Working day end time (default: 17:00)
 * @param {number} interval - Check interval in minutes (default: 30)
 * @returns {Array} Array of available time slots
 */
function findAvailableSlots(appointments, duration, startTime = '09:00', endTime = '17:00', interval = 30) {
  const workDayStart = timeToMinutes(startTime);
  const workDayEnd = timeToMinutes(endTime);
  const availableSlots = [];
  
  // Check every interval from start to end
  for (let currentTime = workDayStart; currentTime + duration <= workDayEnd; currentTime += interval) {
    const timeStr = minutesToTime(currentTime);
    const conflicts = findConflicts(appointments, timeStr, duration);
    
    if (conflicts.length === 0) {
      availableSlots.push({
        time: timeStr,
        duration: duration,
        endTime: minutesToTime(currentTime + duration),
        score: calculateSlotScore(currentTime, workDayStart, workDayEnd)
      });
    }
  }
  
  return availableSlots;
}

/**
 * Calculate score for a time slot (0-100)
 * Higher scores are better. Prefers earlier times and mid-day slots.
 * @param {number} slotTime - Time in minutes
 * @param {number} workDayStart - Work day start in minutes
 * @param {number} workDayEnd - Work day end in minutes
 * @returns {number} Score from 0-100
 */
function calculateSlotScore(slotTime, workDayStart, workDayEnd) {
  const workDayDuration = workDayEnd - workDayStart;
  const positionInDay = (slotTime - workDayStart) / workDayDuration;
  
  // Prefer times between 10 AM and 3 PM (peak productivity)
  const tenAM = 10 * 60;
  const threePM = 15 * 60;
  
  let score = 50; // Base score
  
  // Bonus for being in peak hours (10 AM - 3 PM)
  if (slotTime >= tenAM && slotTime <= threePM) {
    score += 30;
  }
  
  // Bonus for earlier in the day (but after 10 AM)
  if (slotTime >= tenAM) {
    score += (1 - positionInDay) * 20;
  }
  
  return Math.round(score);
}

/**
 * Get the best available slot based on scoring
 * @param {Array} availableSlots - Array of available slots
 * @returns {Object|null} Best slot or null if none available
 */
function getBestSlot(availableSlots) {
  if (!availableSlots || availableSlots.length === 0) {
    return null;
  }
  
  // Sort by score (highest first)
  const sorted = [...availableSlots].sort((a, b) => b.score - a.score);
  return sorted[0];
}

/**
 * Parse natural language text into appointment details
 * @param {string} text - Natural language input
 * @returns {Object} Parsed appointment data
 */
function parseNaturalLanguage(text) {
  try {
    const input = text.toLowerCase().trim();
    const result = {
      success: false,
      title: '',
      date: '',
      time: '',
      duration: 30,
      description: ''
    };

    // Extract title (everything before date/time indicators)
    const titleMatch = input.match(/^(.*?)(?=\s+(?:on|at|tomorrow|today|next|this|[0-9]{1,2}(?:st|nd|rd|th)))/i);
    if (titleMatch) {
      result.title = titleMatch[1].trim()
        .replace(/^(schedule|create|add|book|set up)\s+(a|an|the)?\s*(meeting|appointment)?/i, '')
        .trim() || 'Meeting';
    } else {
      result.title = 'Meeting';
    }

    // Date parsing
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // "today"
    if (input.includes('today')) {
      result.date = formatDate(now);
    }
    // "tomorrow"
    else if (input.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      result.date = formatDate(tomorrow);
    }
    // "next monday", "next week", etc.
    else if (input.match(/next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i)) {
      const dayMatch = input.match(/next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
      const targetDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        .indexOf(dayMatch[1].toLowerCase());
      const nextDate = getNextDayOfWeek(targetDay);
      result.date = formatDate(nextDate);
    }
    // "20th", "25th of this month", "15th"
    else if (input.match(/(\d{1,2})(?:st|nd|rd|th)/i)) {
      const dayMatch = input.match(/(\d{1,2})(?:st|nd|rd|th)/i);
      const day = parseInt(dayMatch[1]);
      
      // Check if month is specified
      const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                          'july', 'august', 'september', 'october', 'november', 'december'];
      let targetMonth = currentMonth;
      
      for (let i = 0; i < monthNames.length; i++) {
        if (input.includes(monthNames[i])) {
          targetMonth = i;
          break;
        }
      }
      
      // "this month" or "next month"
      if (input.includes('next month')) {
        targetMonth = (currentMonth + 1) % 12;
      }
      
      const targetDate = new Date(currentYear, targetMonth, day);
      
      // If date is in the past, assume next occurrence
      if (targetDate < now && !input.includes('of this month')) {
        targetDate.setMonth(targetDate.getMonth() + 1);
      }
      
      result.date = formatDate(targetDate);
    }
    // "in 3 days", "in 2 weeks"
    else if (input.match(/in\s+(\d+)\s+(day|days|week|weeks)/i)) {
      const match = input.match(/in\s+(\d+)\s+(day|days|week|weeks)/i);
      const amount = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      const futureDate = new Date(now);
      
      if (unit.startsWith('day')) {
        futureDate.setDate(futureDate.getDate() + amount);
      } else if (unit.startsWith('week')) {
        futureDate.setDate(futureDate.getDate() + (amount * 7));
      }
      
      result.date = formatDate(futureDate);
    }
    // Default to today if no date found
    if (!result.date) {
      result.date = formatDate(now);
    }

    // Time parsing
    // "8 am", "8am", "8:00 am", "14:00", "2 pm", "2:30pm"
    const timePatterns = [
      /(\d{1,2}):(\d{2})\s*(am|pm)?/i,  // 8:00 am, 14:00
      /(\d{1,2})\s*(am|pm)/i,           // 8 am, 2pm
      /at\s+(\d{1,2}):?(\d{2})?\s*(am|pm)?/i  // at 8:00, at 8am
    ];

    for (const pattern of timePatterns) {
      const match = input.match(pattern);
      if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const meridiem = match[3] ? match[3].toLowerCase() : null;

        // Convert to 24-hour format
        if (meridiem === 'pm' && hours < 12) {
          hours += 12;
        } else if (meridiem === 'am' && hours === 12) {
          hours = 0;
        }

        result.time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        break;
      }
    }

    // Default time if not found
    if (!result.time) {
      result.time = '09:00';
    }

    // Duration parsing
    if (input.match(/(\d+)\s*(min|minute|minutes|hour|hours|hr)/i)) {
      const durationMatch = input.match(/(\d+)\s*(min|minute|minutes|hour|hours|hr)/i);
      const amount = parseInt(durationMatch[1]);
      const unit = durationMatch[2].toLowerCase();
      
      if (unit.startsWith('hour') || unit === 'hr') {
        result.duration = amount * 60;
      } else {
        result.duration = amount;
      }
    } else {
      // Use keyword-based duration
      result.duration = suggestDuration(result.title, input);
    }

    // Extract description
    result.description = `Scheduled via AI: "${text}"`;

    result.success = true;
    return result;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to parse natural language input',
      error: error.message
    };
  }
}

// Helper: Format date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper: Get next occurrence of a day of week
function getNextDayOfWeek(targetDay) {
  const now = new Date();
  const currentDay = now.getDay();
  const daysUntilTarget = (targetDay + 7 - currentDay) % 7 || 7;
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + daysUntilTarget);
  return nextDate;
}

/**
 * Suggest optimal meeting duration based on title/description
 * @param {string} title - Meeting title
 * @param {string} description - Meeting description
 * @returns {number} Suggested duration in minutes
 */
function suggestDuration(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  
  // Quick meetings
  if (text.includes('standup') || text.includes('daily') || text.includes('quick')) {
    return 15;
  }
  
  // Standard meetings
  if (text.includes('sync') || text.includes('check-in') || text.includes('update')) {
    return 30;
  }
  
  // Longer meetings
  if (text.includes('planning') || text.includes('review') || text.includes('workshop')) {
    return 60;
  }
  
  // Extended sessions
  if (text.includes('training') || text.includes('interview') || text.includes('presentation')) {
    return 90;
  }
  
  // Default
  return 30;
}

module.exports = {
  timeToMinutes,
  minutesToTime,
  hasTimeOverlap,
  findConflicts,
  findAvailableSlots,
  calculateSlotScore,
  getBestSlot,
  parseNaturalLanguage,
  suggestDuration
};

import { DAYS_OF_WEEK } from 'data/resources';

export default function getICSEvent({
  name, startTime, endTime, startDate, endDate, isRecurring, recurrenceDays,
}) {
  /* eslint-disable no-param-reassign */
  let dateTimeInfo = '';
  // 1. Events with no start date or end date that recur on certain days
  // 2. Events with no start time or end time
  // 3. Events with a certain start date and end

  if (startDate && !endDate && !isRecurring) endDate = startDate;
  if (startTime && !endTime) {
    const [h, m, s] = startTime.split(':');
    endTime = `${(parseInt(h, 10) + 1).toString().padStart(2, '0')}:${m}:${s}`;
  }

  // Non-recurring events
  if (!isRecurring) {
    // When we have the date and time, include date and time info
    if (startDate && startTime) {
      dateTimeInfo = `
DTSTART;TZID=America/Los_Angeles:${startDate.split('-').join('')}T${startTime.split(':').join('')}
DTEND;TZID=America/Los_Angeles:${endDate.split('-').join('')}T${endTime.split(':').join('')}
`;
    // When we have no time, make an 'all day' event that spans the date range
    } else if (startDate) {
      const [y, m, d] = endDate.split('-');
      dateTimeInfo = `
DTSTART;VALUE=DATE:${startDate.split('-').join('')}
DTEND;VALUE=DATE:${y}${m}${(parseInt(d, 10) + 1).toString().padStart(2, '0')}
`;
    }
  // Recurring events
  } else {
    // No start date or end date provided: start the first day that it would happen past today
    if (!startDate && !endDate) {
      const dayIds = DAYS_OF_WEEK.map((day) => day.id);
      const potentialStartDates = recurrenceDays.map((dow) => {
        const now = new Date();
        now.setDate(now.getDate() + ((dayIds.indexOf(dow) + (7 - now.getDay())) % 7));
        return now;
      });
      startDate = new Date(Math.min(...potentialStartDates)).toISOString().split('T')[0];
    }

    // TODO: generate DTSTART/DTEND using the startDate for two cases (defined time or "all day")
    //       Case 1: should have DTSTART and DTEND on the same day at the start/end time
    //       Case 2: needs exploration; can we do DTSTART;VALUE=DATE:20210516 and leave it there?
    if (endDate) {
      // TODO: add "until" to the end of our RRULE here
    }
  }

  // TODO: maybe add location info and more?

  return `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN

BEGIN:VEVENT
SUMMARY:${name}
${dateTimeInfo}
END:VEVENT

END:VCALENDAR
  `;
}

if (typeof window !== 'undefined') window.getICSEvent = getICSEvent;

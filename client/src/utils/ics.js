import { DAYS_OF_WEEK } from 'data/resources';

export default function getICSEvent({
  name,
  startTime,
  endTime,
  startDate,
  endDate,
  isRecurring,
  recurrenceDays,
  location: resourceLocation,
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
    if (!recurrenceDays.length) throw new Error('A repeating event must specify recurrence days');

    // No start date or end date provided: start the first day that it would happen past today
    const dayIds = DAYS_OF_WEEK.map((day) => day.id);
    if (!startDate) {
      const potentialStartDates = recurrenceDays.map((dow) => {
        const now = new Date();
        now.setUTCDate(now.getUTCDate() + ((dayIds.indexOf(dow) + (7 - now.getUTCDay())) % 7));
        return now;
      });
      if (name === 'Telegraph Community Ministry Center Food Pantry') console.log(potentialStartDates);
      [startDate] = new Date(Math.min(...potentialStartDates)).toISOString().split('T');
    }

    // TODO: generate DTSTART/DTEND using the startDate for two cases (defined time or "all day")
    //       Case 1: should have DTSTART and DTEND on the same day at the start/end time
    if (startTime) {
      dateTimeInfo = `
DTSTART;TZID=America/Los_Angeles:${startDate.split('-').join('')}T${startTime.split(':').join('')}
DTEND;TZID=America/Los_Angeles:${startDate.split('-').join('')}T${endTime.split(':').join('')}
`;
    //       Case 2: can we do DTSTART;VALUE=DATE:20210516 and leave it there?
    } else {
      dateTimeInfo = `
DTSTART;VALUE=DATE:${startDate.split('-').join('')}
`;
    }
    const dayCode = recurrenceDays
      .sort((a, b) => dayIds.indexOf(a) - dayIds.indexOf(b))
      .map((d) => d.slice(0, 2))
      .join(',');
    dateTimeInfo += `RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=${dayCode};`;
    // If there's an end date, add UNTIL to the repeat
    if (endDate) {
      const [y, m, d] = endDate.split('-');
      dateTimeInfo += `UNTIL=${y}${m}${(parseInt(d, 10) + 1).toString().padStart(2, '0')}T000000Z`;
    }
  }

  // TODO: maybe add location info and more?
  let formattedLocation = '';
  if (resourceLocation?.location_title) formattedLocation += `${resourceLocation?.location_title}\n`;
  if (resourceLocation?.street_address) formattedLocation += `${resourceLocation?.street_address}\n`;
  formattedLocation += [resourceLocation?.city, resourceLocation?.state, resourceLocation?.zip_code].filter((n) => n).join(', ');

  let locationField = '';
  if (formattedLocation.length) locationField = `LOCATION:${formattedLocation.replace(/([,\\;])/g, '\\$1').replace(/\n/g, '\\n')}`;

  return `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN

BEGIN:VEVENT
SUMMARY:${name}
${dateTimeInfo}
${locationField}
END:VEVENT

END:VCALENDAR
`;
}

/* eslint-disable import/prefer-default-export */

import { DAYS_OF_WEEK } from 'data/resources';

const dayMs = 1000 * 60 * 60 * 24;
// Get the days of the week that appear in a given date range
export function dowsInRange(startDate, endDate) {
  if (!startDate || !endDate) return [];
  const a = new Date(startDate);
  const b = new Date(endDate);
  const dayNumbers = [];
  for (
    let d = new Date(a); //             Start at start date
    d <= b && (d - a <= dayMs * 6); //  loop through date range; no need to cover more than 7 days
    d.setUTCDate(d.getUTCDate() + 1) // Advance one date each time
  ) {
    dayNumbers.push(d.getUTCDay());
  }
  return dayNumbers.sort().map((d) => DAYS_OF_WEEK[d].id);
}

export function matchesDays(resource, daysOfWeek) {
  // Recurring resources: one or more of the days of the week appears in the resource's
  // recurrenceDays
  if (resource.isRecurring) return daysOfWeek.some((d) => resource.recurrenceDays?.includes?.(d));
  // Non-recurring resources: one or more of the days of the week appears in the resource's
  // startDate/endDate range
  const matchDaysOfWeek = dowsInRange(resource.startDate, resource.endDate);
  return daysOfWeek.some((d) => matchDaysOfWeek.includes(d));
}

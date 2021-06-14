/* eslint-disable import/prefer-default-export */

import fuzzysort from 'fuzzysort';

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


export default function filterResources(passedResources, filters) {
  let resources = passedResources;
  // Text search
  if (filters.search) {
    const results = fuzzysort.go(
      filters.search,
      resources,
      { keys: ['name', 'organization'] },
    );
    resources = results.map((result) => result.obj);
  }
  // Other filters
  resources = resources.filter((r) => {
    let include = true;
    // Category filter
    if (filters.categories?.length) { include &&= filters.categories.includes(r.category); }
    // Day of week filter
    if (filters.daysOfWeek?.length) { include &&= matchesDays(r, filters.daysOfWeek); }

    // Date filter

    // If start date is after end date, no results should be returned
    if (
      filters.startMonth && filters.startDay && filters.startYear
      && filters.endMonth && filters.endDay && filters.endYear
      && (
        new Date(`${filters.startYear}-${filters.startMonth}-${filters.startDay}`)
        > new Date(`${filters.endYear}-${filters.endMonth}-${filters.endDay}`)
      )
    ) return false;

    if (filters.startMonth && filters.startDay && filters.startYear) {
      include &&= r.endDate && new Date(r.endDate) >= new Date(`${filters.startYear}-${filters.startMonth}-${filters.startDay}`);
    }
    if (filters.endMonth && filters.endDay && filters.endYear) {
      include &&= r.startDate && new Date(r.startDate) <= new Date(`${filters.endYear}-${filters.endMonth}-${filters.endDay}`);
    }

    // Time filter

    const time = (hh, mm) => new Date(`1970-01-01T${hh}:${mm}:00Z`);
    // If start time is after end time, no results should be returned
    if (
      filters.startHour && filters.startMinute && filters.endHour && filters.endMinute
      && time(filters.startHour, filters.startMinute) > time(filters.endHour, filters.endMinute)
    ) return false;

    if (filters.startHour && filters.startMinute) {
      include &&= r.endTime && time(...r.endTime.split(':')) >= time(filters.startHour, filters.startMinute);
    }
    if (filters.endHour && filters.endMinute) {
      include &&= r.startTime && time(...r.startTime.split(':')) <= time(filters.endHour, filters.endMinute);
    }
    return include;
  });

  return resources;
}


// Latitude/longitude filters happen in a separate step so that the map can display everything

export const geoFilterResources = (
  resources,
  { min_lat: minLat, max_lat: maxLat, min_lng: minLng, max_lng: maxLng },
) => resources.filter(({ location }) => {
  if ((minLat || maxLat || minLng || maxLng) && !location) return false;
  const { latitude: resourceLat, longitude: resourceLng } = location || {};
  if (minLat && (resourceLat < minLat)) return false;
  if (maxLat && (resourceLat > maxLat)) return false;
  if (minLng && (resourceLng < minLng)) return false;
  if (maxLng && (resourceLng > maxLng)) return false;
  return true;
});

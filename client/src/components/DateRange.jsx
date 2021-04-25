/* Semantic rendering of date/time ranges that might have a start, an end, both, or neither. */

import React from 'react';
import { datePropType, timePropType } from 'data/resources';

export function DateRange({ from: startDate, to: endDate }) {
  return (
    <span>
      {startDate && new Date(startDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}
      {endDate && (!startDate || endDate !== startDate) && (startDate ? ' to ' : ' Until ')}
      {endDate && (!startDate || endDate !== startDate) && new Date(endDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}
    </span>
  );
}

DateRange.propTypes = {
  from: datePropType,
  to: datePropType,
};
DateRange.defaultProps = {
  from: null,
  to: null,
};


export function TimeRange({ from: startTime, to: endTime }) {
  return (
    <span>
      {startTime && new Date(`1970-01-01T${startTime}Z`).toLocaleTimeString('en-US', { timeStyle: 'short', timeZone: 'UTC' })}
      {endTime && (startTime ? ' to ' : ' Until ')}
      {endTime && new Date(`1970-01-01T${endTime}Z`).toLocaleTimeString('en-US', { timeStyle: 'short', timeZone: 'UTC' })}
    </span>
  );
}

TimeRange.propTypes = {
  from: timePropType,
  to: timePropType,
};
TimeRange.defaultProps = {
  from: null,
  to: null,
};

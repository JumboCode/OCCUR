/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SidebarFilter.module.scss';
import { RESOURCE_CATEGORIES } from 'data/resources';

const DAYS_OF_WEEK = [
  { id: 'MON', label: 'Monday' },
  { id: 'TUES', label: 'Tuesday' },
  { id: 'WED', label: 'Wednesday' },
  { id: 'THURS', label: 'Thursday' },
  { id: 'FRI', label: 'Friday' },
  { id: 'SAT', label: 'Saturday' },
  { id: 'SUN', label: 'Sunday' },
]

const DATE_FORMAT = 'mm/dd/yyyy';
const TIME_FORMAT = 'hh:mm';

// taken from Luke's codepen.io: https://codesandbox.io/s/lively-cache-67v89?file=/src/App.js
// slightly modified to simply return the nicely formatted date
const formatDateInput = (e) => {
  // Only take numeric characters from the input
  const val = [...e.target.value]
    .filter((c) => c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57)
    .join("");
  // Automatically format with slashes when we put the new value in the input
  let out = val.slice(0, 2);
  if (val.length > 2) {
    out += "/" + val.slice(2, 4);
  }
  if (val.length > 4) {
    out += "/" + val.slice(4, 8);
  }
  
  return out;
}

// does pretty much the same thing as formatDateInput, but for time 
const formatTimeInput = (e) => {
  // only taking numeric characters from input
  const val = [...e.target.value]
    .filter((c) => c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57)
    .join('');
  // automatically format with colon
  let out = val.slice(0, 2);
  if (val.length > 2) {
      out += ':' + val.slice(2, 4);
  } 

  return out;
}

// parses the date according to DATE_FORMAT
const parseValidDate = (dateStr) => {
  return [dateStr.substring(0, 2), dateStr.substring(3, 5), dateStr.substring(6, 11)];
}

export default function SidebarFilter({ values, onChange }) {
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  return (
    <div className={styles.base}>
      <div className={styles.group}>
        <h4>Category</h4>
        {
          RESOURCE_CATEGORIES.map(({ id, label }) => (
            <label key={id}>
              <input
                type="checkbox"
                checked={values.categories.includes(id)}
                onChange={() => {
                  if (!values.categories.includes(id)) {
                    // Add this checkbox to the array
                    onChange({
                      ...values,
                      categories: [...values.categories, id],
                    });
                  } else {
                    // Remove this checkbox from the array
                    onChange({
                      ...values,
                      categories: values.categories.filter((val) => val !== id),
                    });
                  }
                }}
              />
              <div className={styles.checkbox} />
              {label}
            </label>
          ))
        }
      </div>
      <div className={styles.group}>
        <h4>Day of the week</h4>
        {
          DAYS_OF_WEEK.map(({ id, label }) => (
            <label key={id}>
              <input
                type="checkbox"
                checked={values.daysOfWeek.includes(id)}
                onChange={() => {
                  if (!values.daysOfWeek.includes(id)) {
                    // Add this checkbox to the array
                    onChange({
                      ...values,
                      daysOfWeek: [...values.daysOfWeek, id],
                    });
                  } else {
                    // Remove this checkbox from the array
                    onChange({
                      ...values,
                      daysOfWeek: values.daysOfWeek.filter((val) => val !== id),
                    });
                  }
                }}
              />
              <div className={styles.checkbox} />
              {label}
            </label>
          ))
        }
      </div>
      <div className={styles.group}>
        <h4>Date</h4>
        <label htmlFor="date-range-begin">From</label>
        <input id="date-range-begin" type="text" placeholder={DATE_FORMAT}
          onChange={(e) => {
            setStartDate(formatDateInput(e));
              if (startDate.length === DATE_FORMAT.length) {
                  const [month, day, year] = parseValidDate(startDate);
                  onChange({
                    ...values,
                    startDate: {
                      month: month,
                      day: day,
                      year: year,
                    },
                  });
              }
              else {
                if (startDate.length !== 0) {
                    // set edges to red for error
                }
                onChange({
                  ...values,
                  startDate: {
                    month: '',
                    day: '',
                    year: '',
                  },
                });
              }
          }} value={startDate}></input>
        <label htmlFor="date-range-end">To</label>
        <input id="date-range-end" type="text" placeholder={DATE_FORMAT}
          onChange={(e) => {
            setEndDate(formatDateInput(e));
            if (endDate.length === DATE_FORMAT.length) {
              const [month, day, year] = parseValidDate(endDate);
              onChange({
                ...values,
                endDate: {
                  month: month,
                  day: day,
                  year: year,
                },
              });
            }
            else {
              if (endDate.length !== 0) {
                // set edges to red for error
              }
              onChange({
                ...values,
                endDate: {
                  month: '',
                  day: '',
                  year: '',
                },
              });
            }
          }}
          value={endDate}></input>
      </div>
      <div className={styles.group}>
        <h4>Time</h4>
        <label htmlFor="time-range-start">From</label>
        <input id="time-range-start" type="text" placeholder={TIME_FORMAT}
          onChange={(e) => { setStartTime(formatTimeInput(e)); }}
          value={startTime}></input>
      </div>
    </div>
  );
}
SidebarFilter.propTypes = {
  values: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.oneOf(
      RESOURCE_CATEGORIES.map((e) => e.id)
    )).isRequired,
    daysOfWeek: PropTypes.arrayOf(PropTypes.oneOf(
      DAYS_OF_WEEK.map((e) => e.id)
    )).isRequired,
    startTime: PropTypes.shape({
      hour: PropTypes.string.isRequired,
      min: PropTypes.string.isRequired,
      timePeriod: PropTypes.string.isRequired,
    }),
    endTime: PropTypes.shape({
      hour: PropTypes.string.isRequired,
      min: PropTypes.string.isRequired,
      timePeriod: PropTypes.string.isRequired,
    }),
    startDate: PropTypes.shape({
      month: PropTypes.string.isRequired,
      day: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    }),
    endDate: PropTypes.shape({
      month: PropTypes.string.isRequired,
      day: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    }),
  }),
  onChange: PropTypes.func.isRequired,
};

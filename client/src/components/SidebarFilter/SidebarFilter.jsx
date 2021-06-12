/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SidebarFilter.module.scss';
import { RESOURCE_CATEGORIES, DAYS_OF_WEEK } from 'data/resources';

const DATE_FORMAT = 'mm/dd/yyyy';
const TIME_FORMAT = 'hh:mm';

// taken from Luke's codepen.io: https://codesandbox.io/s/lively-cache-67v89?file=/src/App.js
// slightly modified to simply return the nicely formatted date
const formatDateInput = (e) => {
  // Only take numeric characters from the input
  const val = [...e.target.value]
    .filter((c) => c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57)
    .join('');
  // Automatically format with slashes when we put the new value in the input
  let out = val.slice(0, 2);
  if (val.length > 2) {
    out += `/${val.slice(2, 4)}`;
  }
  if (val.length > 4) {
    out += `/${val.slice(4, 8)}`;
  }
  return out;
};

// does pretty much the same thing as formatDateInput, but for time
const formatTimeInput = (e) => {
  // only taking numeric characters from input
  const val = [...e.target.value]
    .filter((c) => c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57)
    .join('');
  // automatically format with colon
  let out = val.slice(0, 2);
  if (val.length > 2) {
    out += `:${val.slice(2, 4)}`;
  }

  return out;
};

// parses the date according to DATE_FORMAT
const parseValidDate = (dateStr) => [
  dateStr.substring(0, 2), dateStr.substring(3, 5), dateStr.substring(6, 11),
];

// parses the time according to TIME_FORMAT
const parseValidTime = (timeStr) => [timeStr.substring(0, 2), timeStr.substring(3, 5)];

const getInvalidStyle = (i, targetFmt) => (
  (i.length > 0 && i.length < targetFmt.length)
    ? styles.invalid
    : styles.validInput);

export default function SidebarFilter({ values, onChange }) {
  const startTimeFromUrl = [values.startTime.hour, values.startTime.min].filter((n) => n?.length).join(':');
  const endTimeFromUrl = [values.endTime.hour, values.endTime.min].filter((n) => n?.length).join(':');
  const startDateFromUrl = [values.startDate.month, values.startDate.day, values.startDate.year]
    .filter((n) => n?.length).join('/');
  const endDateFromUrl = [values.endDate.month, values.endDate.day, values.endDate.year]
    .filter((n) => n?.length).join('/');

  const [startTimeDisp, setStartTimeDisp] = useState(startTimeFromUrl);
  const [endTimeDisp, setEndTimeDisp] = useState(endTimeFromUrl);
  const [startDateDisp, setStartDateDisp] = useState(startDateFromUrl);
  const [endDateDisp, setEndDateDisp] = useState(endDateFromUrl);

  const [startTimePeriod, setStartTimePeriod] = useState(values.startTime.timePeriod);
  const [endTimePeriod, setEndTimePeriod] = useState(values.endTime.timePeriod);

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
        <input
          id="date-range-begin"
          type="text"
          placeholder={DATE_FORMAT}
          className={getInvalidStyle(startDateDisp, DATE_FORMAT)}
          onChange={(e) => {
            const newValue = formatDateInput(e);
            setStartDateDisp(newValue);
            if (newValue === DATE_FORMAT.length) {
              const [month, day, year] = parseValidDate(newValue);
              onChange({
                ...values,
                startDate: { month, day, year },
              });
            } else {
              onChange({
                ...values,
                startDate: {
                  month: '',
                  day: '',
                  year: '',
                },
              });
            }
          }}
          value={startDateDisp}
        />
        <label htmlFor="date-range-end">To</label>
        <input
          id="date-range-end"
          type="text"
          placeholder={DATE_FORMAT}
          className={getInvalidStyle(endDateDisp, DATE_FORMAT)}
          onChange={(e) => {
            const newValue = formatDateInput(e);
            setEndDateDisp(newValue);
            if (newValue.length === DATE_FORMAT.length) {
              const [month, day, year] = parseValidDate(newValue);
              onChange({
                ...values,
                endDate: { month, day, year },
              });
            } else {
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
          value={endDateDisp}
        />
      </div>
      <div className={styles.group}>
        <h4>Time</h4>
        <label htmlFor="time-range-start">From</label>
        <input
          id="time-range-start"
          type="text"
          placeholder={TIME_FORMAT}
          className={getInvalidStyle(startTimeDisp, TIME_FORMAT)}
          onChange={(e) => {
            const newValue = formatTimeInput(e);
            setStartTimeDisp(newValue);
            if (newValue.length === TIME_FORMAT.length) {
              const [hour, min] = parseValidTime(newValue);
              onChange({
                ...values,
                startTime: {
                  hour,
                  min,
                  timePeriod: startTimePeriod,
                },
              });
            } else {
              onChange({
                ...values,
                startTime: {
                  hour: '',
                  min: '',
                  timePeriod: '',
                },
              });
            }
          }}
          value={startTimeDisp}
        />
        <label htmlFor="time-range-start-AM">AM</label>
        <input
          id="time-range-start-AM"
          type="radio"
          name="start-period"
          value="AM"
          onChange={(e) => {
            const newValue = e.target.value;
            setStartTimePeriod(newValue);
            if (startTimeDisp.length === TIME_FORMAT.length) {
              const [hour, min] = parseValidTime(startTimeDisp);
              onChange({
                ...values,
                startTime: {
                  hour,
                  min,
                  timePeriod: newValue,
                },
              });
            } else {
              onChange({
                ...values,
                startTime: {
                  hour: '',
                  min: '',
                  timePeriod: '',
                },
              });
            }
          }}
          checked={startTimePeriod === 'AM'}
        />
        <label htmlFor="time-range-start-PM">PM</label>
        <input
          id="time-range-start-PM"
          type="radio"
          name="start-period"
          value="PM"
          onChange={(e) => {
            const newValue = e.target.value;
            setStartTimePeriod(newValue);
            if (startTimeDisp.length === TIME_FORMAT.length) {
              const [hour, min] = parseValidTime(startTimeDisp);
              onChange({
                ...values,
                startTime: {
                  hour,
                  min,
                  timePeriod: newValue,
                },
              });
            } else {
              onChange({
                ...values,
                startTime: {
                  hour: '',
                  min: '',
                  timePeriod: '',
                },
              });
            }
          }}
          checked={startTimePeriod === 'PM'}
        />
        <label htmlFor="time-range-end">To</label>
        <input
          id="time-range-end"
          type="text"
          placeholder={TIME_FORMAT}
          className={getInvalidStyle(endTimeDisp, TIME_FORMAT)}
          onChange={(e) => {
            const newValue = formatTimeInput(e);
            setEndTimeDisp(newValue);
            if (newValue.length === TIME_FORMAT.length) {
              const [hour, min] = parseValidTime(newValue);
              onChange({
                ...values,
                endTime: {
                  hour,
                  min,
                  timePeriod: endTimePeriod,
                },
              });
            } else {
              onChange({
                ...values,
                endTime: {
                  hour: '',
                  min: '',
                  timePeriod: '',
                },
              });
            }
          }}
          value={endTimeDisp}
        />
        <label htmlFor="time-range-end-AM">AM</label>
        <input
          id="time-range-end-AM"
          type="radio"
          name="end-period"
          value="AM"
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue.length === TIME_FORMAT.length) {
              const [hour, min] = parseValidTime(newValue);
              onChange({
                ...values,
                endTime: {
                  hour,
                  min,
                  timePeriod: endTimePeriod,
                },
              });
            } else {
              onChange({
                ...values,
                endTime: {
                  hour: '',
                  min: '',
                  timePeriod: '',
                },
              });
            }
          }}
          checked={values.endTime.timePeriod === 'AM'}
        />
        <label htmlFor="time-range-end-PM">PM</label>
        <input
          id="time-range-end-PM"
          type="radio"
          name="end-period"
          value="PM"
          onChange={(e) => {
            const newValue = e.target.value;
            setEndTimePeriod(newValue);
            if (endTimeDisp.length === TIME_FORMAT.length) {
              const [hour, min] = parseValidTime(endTimeDisp);
              onChange({
                ...values,
                endTime: {
                  hour,
                  min,
                  timePeriod: newValue,
                },
              });
            } else {
              onChange({
                ...values,
                endTime: {
                  hour: '',
                  min: '',
                  timePeriod: '',
                },
              });
            }
          }}
          checked={endTimePeriod === 'PM'}
        />
      </div>
    </div>
  );
}
SidebarFilter.propTypes = {
  values: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.oneOf(
      RESOURCE_CATEGORIES.map((e) => e.id),
    )).isRequired,
    daysOfWeek: PropTypes.arrayOf(PropTypes.oneOf(
      DAYS_OF_WEEK.map((e) => e.id),
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
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

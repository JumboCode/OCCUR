/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { unstable_batchedUpdates } from 'react-dom'; // eslint-disable-line camelcase
import PropTypes from 'prop-types';
import { RESOURCE_CATEGORIES, DAYS_OF_WEEK } from 'data/resources';

import classNames from 'classnames/bind';
import styles from './SidebarFilter.module.scss';
const cx = classNames.bind(styles);

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
// output: ['mm', 'dd', 'yyyy']
const parseValidDate = (dateStr) => [
  dateStr.substring(0, 2), dateStr.substring(3, 5), dateStr.substring(6, 11),
];

// parses the time according to TIME_FORMAT
// output: ['hh', 'mm']
const parseValidTime = (timeStr) => [timeStr.substring(0, 2), timeStr.substring(3, 5)];

const validateTime = (time) => /[0-9]{2}:[0-9]{2}/.test(time) // format is correct
  && parseValidTime(time)[0] <= 12 // valid hour (no 13:00)
  && parseValidTime(time)[0] > 0 // valid hour (no 00:00)
  && parseValidTime(time)[1] <= 60; // valid minute

const validateDate = (date) => /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/.test(date) // format is correct
  // valid month
  && parseValidDate(date)[0] <= 12
  // day fits in that month on that year (year only matters for feb 29)
  && ((month, day, year) => {
    const d = new Date();
    d.setFullYear(year);
    d.setMonth(month - 1);
    d.setDate(day);
    return d.getMonth() === month - 1; // check for overflow
  })(...parseValidDate(date));


const SidebarFilter = React.forwardRef(({ values, onChange }, ref) => {
  const startTimeFromUrl = [values.startTime.hour, values.startTime.min].filter((n) => n?.length).join(':');
  const endTimeFromUrl = [values.endTime.hour, values.endTime.min].filter((n) => n?.length).join(':');
  const startDateFromUrl = [values.startDate.month, values.startDate.day, values.startDate.year]
    .filter((n) => n?.length).join('/');
  const endDateFromUrl = [values.endDate.month, values.endDate.day, values.endDate.year]
    .filter((n) => n?.length).join('/');

  const [startDateDisp, setStartDateDisp] = useState(startDateFromUrl);
  const [endDateDisp, setEndDateDisp] = useState(endDateFromUrl);

  const [startTimeDisp, setStartTimeDisp] = useState(startTimeFromUrl);
  const [startTimePeriod, setStartTimePeriod] = useState(values.startTime.timePeriod);
  const [endTimeDisp, setEndTimeDisp] = useState(endTimeFromUrl);
  const [endTimePeriod, setEndTimePeriod] = useState(values.endTime.timePeriod);

  useImperativeHandle(ref, () => ({
    clearInputs() {
      unstable_batchedUpdates(() => { // TODO: remove with React 18 if this app ever gets updated
        setStartDateDisp('');
        setStartTimeDisp('');
        setStartTimePeriod('AM');
        setEndDateDisp('');
        setEndTimeDisp('');
        setEndTimePeriod('AM');
      });
    },
  }));

  const valuesRef = useRef(values);
  valuesRef.current = values;
  // Pass entered startDate upwards
  useEffect(() => {
    if (validateDate(startDateDisp)) {
      const [month, day, year] = parseValidDate(startDateDisp);
      onChange({ startDate: { month, day, year } });
    } else {
      onChange({ startDate: { month: '', day: '', year: '' } });
    }
  }, [onChange, startDateDisp]);
  // Pass entered endDate upwards
  useEffect(() => {
    if (validateDate(endDateDisp)) {
      const [month, day, year] = parseValidDate(endDateDisp);
      onChange({ endDate: { month, day, year } });
    } else {
      onChange({ endDate: { month: '', day: '', year: '' } });
    }
  }, [onChange, endDateDisp]);

  // Pass entered startTime upwards
  useEffect(() => {
    if (validateTime(startTimeDisp)) {
      const [hour, min] = parseValidTime(startTimeDisp);
      onChange({ startTime: { hour, min, timePeriod: startTimePeriod } });
    } else {
      onChange({ startTime: { hour: '', min: '', timePeriod: '' } });
    }
  }, [onChange, startTimeDisp, startTimePeriod]);
  // Pass entered endTime upwards
  useEffect(() => {
    if (validateTime(endTimeDisp)) {
      const [hour, min] = parseValidTime(endTimeDisp);
      onChange({ endTime: { hour, min, timePeriod: endTimePeriod } });
    } else {
      onChange({ endTime: { hour: '', min: '', timePeriod: '' } });
    }
  }, [onChange, endTimeDisp, endTimePeriod]);

  return (
    <div className={cx('base')}>
      <div className={cx('group')}>
        <h4>Category</h4>
        {
          RESOURCE_CATEGORIES.map(({ id, label }) => (
            <label key={id} className={cx('checkbox')}>
              <input
                type="checkbox"
                checked={values.categories.includes(id)}
                onChange={() => {
                  if (!values.categories.includes(id)) {
                    // Add this checkbox to the array
                    onChange({ categories: [...values.categories, id] });
                  } else {
                    // Remove this checkbox from the array
                    onChange({ categories: values.categories.filter((val) => val !== id) });
                  }
                }}
              />
              <div className={cx('checkbox')} />
              {label}
            </label>
          ))
        }
      </div>
      <div className={cx('group')}>
        <h4>Day of the week</h4>
        {
          DAYS_OF_WEEK.map(({ id, label }) => (
            <label key={id} className={cx('checkbox')}>
              <input
                type="checkbox"
                checked={values.daysOfWeek.includes(id)}
                onChange={() => {
                  if (!values.daysOfWeek.includes(id)) {
                    // Add this checkbox to the array
                    onChange({ daysOfWeek: [...values.daysOfWeek, id] });
                  } else {
                    // Remove this checkbox from the array
                    onChange({ daysOfWeek: values.daysOfWeek.filter((val) => val !== id) });
                  }
                }}
              />
              <div className={cx('checkbox')} />
              {label}
            </label>
          ))
        }
      </div>
      <div className={cx('group')}>
        <h4>Date</h4>
        <label className={cx('text')}>
          From
          <input
            type="text"
            placeholder={DATE_FORMAT}
            className={cx({ invalid: !validateDate(startDateDisp) })}
            onChange={(e) => { setStartDateDisp(formatDateInput(e)); }}
            value={startDateDisp}
          />
        </label>

        <label className={cx('text')}>
          To
          <input
            type="text"
            placeholder={DATE_FORMAT}
            className={cx({ invalid: !validateDate(endDateDisp) })}
            onChange={(e) => { setEndDateDisp(formatDateInput(e)); }}
            value={endDateDisp}
          />
        </label>
      </div>
      <div className={cx('group')}>
        <h4>Time</h4>
        {/* START TIME AND AM/PM */}
        <label className={cx('text')}>
          From
          <input
            type="text"
            placeholder={TIME_FORMAT}
            className={cx({ invalid: !validateTime(startTimeDisp) })}
            onChange={(e) => { setStartTimeDisp(formatTimeInput(e)); }}
            value={startTimeDisp}
          />
        </label>
        <div className={styles['am-pm']}>
          <label>
            <input
              type="radio"
              name="start-period"
              value="AM"
              onChange={(e) => { setStartTimePeriod(e.target.value); }}
              checked={startTimePeriod === 'AM'}
            />
            AM
          </label>
          <label>
            <input
              type="radio"
              name="start-period"
              value="PM"
              onChange={(e) => { setStartTimePeriod(e.target.value); }}
              checked={startTimePeriod === 'PM'}
            />
            PM
          </label>
        </div>
        {/* END TIME AND AM/PM */}
        <label className={cx('text')}>
          To
          <input
            type="text"
            placeholder={TIME_FORMAT}
            className={cx({ invalid: !validateTime(endTimeDisp) })}
            onChange={(e) => { setEndTimeDisp(formatTimeInput(e)); }}
            value={endTimeDisp}
          />
        </label>
        <div className={styles['am-pm']}>
          <label>
            <input
              type="radio"
              name="end-period"
              value="AM"
              onChange={(e) => { setEndTimePeriod(e.target.value); }}
              checked={values.endTime.timePeriod === 'AM'}
            />
            AM
          </label>
          <label>
            <input
              type="radio"
              name="end-period"
              value="PM"
              onChange={(e) => { setEndTimePeriod(e.target.value); }}
              checked={endTimePeriod === 'PM'}
            />
            PM
          </label>
        </div>
      </div>
    </div>
  );
});

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


export default SidebarFilter;

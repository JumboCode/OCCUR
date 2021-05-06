/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
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
];

export default function SidebarFilter({ values, onChange }) {
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
    </div>
  );
}
SidebarFilter.propTypes = {
  values: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.oneOf(
      RESOURCE_CATEGORIES.map((e) => e.id)
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
      date: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    }),
    endDate: PropTypes.shape({
      month: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    }),
  }),
  onChange: PropTypes.func.isRequired,
};

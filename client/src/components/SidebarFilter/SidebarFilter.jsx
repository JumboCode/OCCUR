/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './SidebarFilter.module.scss';
import RESOURCE_TYPES from 'data/resource-types';


export default function SidebarFilter({ values, onChange }) {
  return (
    <div className={styles.base}>
      <div className={styles.group}>
        <h4>Category</h4>
        {
          RESOURCE_TYPES.map(({ id, label }) => (
            <label key={id}>
              <input
                type="checkbox"
                checked={values.includes(id)}
                onChange={() => {
                  if (!values.includes(id)) {
                    // Add this checkbox to the array
                    onChange([...values, id]);
                  } else {
                    // Remove this checkbox from the array
                    onChange(values.filter((val) => val !== id));
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
  values: PropTypes.arrayOf(PropTypes.oneOf([
    'FOOD',
    'HOUSING',
    'COMM_GIVE',
    'MENTAL_HEALTH',
    'INFO',
    'EVENTS',
    'WIFI',
    'OTHER',
  ])).isRequired,
  onChange: PropTypes.func.isRequired,
};

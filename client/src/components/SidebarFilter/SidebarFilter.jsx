/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import styles from './SidebarFilter.module.scss';

export default function SidebarFilter() {
  return (
    <div className={styles.base}>
      <div className={styles.group}>
        <h4>Category</h4>
        <label>
          <input type="checkbox" />
          <div className={styles.checkbox} />
          Community Giveaways
        </label>
        <label>
          <input type="checkbox" />
          <div className={styles.checkbox} />
          Education
        </label>
        <label>
          <input type="checkbox" />
          <div className={styles.checkbox} />
          Food
        </label>
        <label>
          <input type="checkbox" />
          <div className={styles.checkbox} />
          Housing
        </label>
        <label>
          <input type="checkbox" />
          <div className={styles.checkbox} />
          Info Sessions/Webinars
        </label>
        <label>
          <input type="checkbox" />
          <div className={styles.checkbox} />
          Mental Health
        </label>
        <label>
          <input type="checkbox" />
          <div className={styles.checkbox} />
          Other
        </label>
      </div>
      <div className={styles.group}>
        <h4>Resource Type</h4>
        <label>
          <input type="checkbox" />
          <div className={styles.checkbox} />
          OCCUR
        </label>
        <label className={styles.orange}>
          <input type="checkbox" />
          <div className={styles.checkbox} />
          Community Offerings
        </label>
        <label className={styles.yellow}>
          <input type="checkbox" />
          <div className={styles.checkbox} />
          Free Wi-Fi Hotspots
        </label>
      </div>

    </div>
  );
}

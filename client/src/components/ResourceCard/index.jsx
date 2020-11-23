import React from 'react';
import PropTypes from 'prop-types';
import styles from './ResourceCard.module.scss';

import ClockIcon from '../../../public/clock.svg';

export default function ResourceCard({
  resourceTitle, organization, startDate, endDate, location, imageSrc, startTime, endTime
}) {
  return (
    <div className={styles.container}>
      <div className={styles.ResourceInfo}>
        <div className={styles.leftside}>
          {/* <h1>hi</h1> */}
        </div>

        <div className={styles.rightside}>
          <h3>{resourceTitle}</h3>
          <h6>{organization}</h6>
          <ClockIcon />
          <h4>{startDate.toLocaleDateString()}</h4>
          <h4>{location}</h4>
          <h4>{startTime.toLocaleTimeString('en-US')}</h4>
          <h4>{endTime.toLocaleTimeString('en-US')}</h4>
        </div>
      </div>
    </div>
  );
}

ResourceCard.propTypes = {
  resourceTitle: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  location: PropTypes.string.isRequired,
  startTime: PropTypes.instanceOf(Date).isRequired,
  endTime: PropTypes.instanceOf(Date).isRequired,

};

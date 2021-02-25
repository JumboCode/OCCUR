import React from 'react';
import PropTypes from 'prop-types';
import styles from './ResourceCard.module.scss';

import ClockIcon from '../../../public/clock.svg';
import PinIcon from '../../../public/pin.svg';
import CalendarIcon from '../../../public/calendar.svg';

export default function ResourceCard({
  resourceTitle, organization, startDate, endDate, location, imageSrc, startTime, endTime,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.ResourceInfo}>
        <div className={styles.leftside} />

        <div className={styles.rightside}>
          <h3>{resourceTitle}</h3>
          <h6>{organization}</h6>
          <p>
            <CalendarIcon />
            {startDate.toLocaleDateString()}
          </p>
          <p>
            <ClockIcon />
            {startTime.toLocaleTimeString('en-US')}
            {' to '}
            {endTime.toLocaleTimeString('en-US')}
          </p>
          <p>
            <PinIcon />
            {location}
          </p>
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

import React from 'react';
import PropTypes from 'prop-types';
import styles from './ResourceCard.module.scss';

import ClockIcon from '../../../public/clock.svg';
import PinIcon from '../../../public/pin.svg';
import CalendarIcon from '../../../public/calendar.svg';
import ViewIcon from '../../../public/view.svg';
import Calendar2Icon from '../../../public/calendar2.svg';
import ShareIcon from '../../../public/share.svg';


export default function ResourceCard({
  resourceTitle, organization, startDate, location, imageSrc, startTime, endTime,
}) {
  return (
    <div className={styles.base}>
      <div className={styles.leftside} />

      <div className={styles.rightside}>
        <div className={styles.content}>
          <h3>{resourceTitle}</h3>
          <p className={styles.subtitle}>{organization}</p>
          <p className={styles['icon-line']}>
            <CalendarIcon />
            {startDate.toLocaleDateString()}
          </p>
          <p className={styles['icon-line']}>
            <ClockIcon />
            {startTime.toLocaleTimeString('en-US')}
            {' to '}
            {endTime.toLocaleTimeString('en-US')}
          </p>
          <p className={styles['icon-line']}>
            <PinIcon />
            {location}
          </p>
        </div>

        <a className={styles.cta}>
          View more
          <ViewIcon />
        </a>

        <div className={styles.buttons}>
          <button type="button">
            <Calendar2Icon />
            Add to Calendar
          </button>
          <button type="button">
            <ShareIcon />
            Share
          </button>
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

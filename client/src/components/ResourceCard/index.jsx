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
  resourceTitle, organization, startDate, endDate, location, imageSrc, startTime, endTime,
}) {
  return (
    <div>
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
          <p>
            <div className={styles.shareicon}>
              <ShareIcon />
              <a className={styles.caption} href="https://www.w3schools.com/">Share</a>
            </div>
          </p>
          <p>
            <div className={styles.viewicon}>
              <a className={styles.caption2} href="https://www.w3schools.com/">View more</a>
              <ViewIcon />
            </div>

          </p>
          <p>
            <div className={styles.calendaricon}>
              <Calendar2Icon />
              <a className={styles.caption} href="https://www.w3schools.com/">Add to Calendar</a>
            </div>
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

import React from 'react';
import PropTypes from 'prop-types';
import styles from './ResourceCard.module.scss';

import MaybeLink from 'components/MaybeLink';

import ClockIcon from '../../../public/clock.svg';
import PinIcon from '../../../public/pin.svg';
import CalendarIcon from '../../../public/calendar.svg';
import ViewIcon from '../../../public/view.svg';
import Calendar2Icon from '../../../public/calendar2.svg';
import ShareIcon from '../../../public/share.svg';


export default function ResourceCard({
  name, organization, startDate, endDate, location, flyer, startTime, endTime,
}) {
  return (
    <div className={styles.base}>
      <div className={styles.leftside} style={flyer && { backgroundImage: `url(${flyer})` }} />

      <div className={styles.rightside}>
        <div className={styles.content}>
          <h3>{name}</h3>
          {organization && <p className={styles.subtitle}>{organization}</p>}
          { (startDate || endDate) && (
            <p className={styles['icon-line']}>
              <CalendarIcon />
              {startDate && new Date(startDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}
              {endDate && (startDate ? ' to ' : ' Until ')}
              {endDate && new Date(endDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}
            </p>
          )}
          {
            (startTime || endTime) && (
              <p className={styles['icon-line']}>
                <ClockIcon />
                {startTime && new Date(`1970-01-01T${startTime}Z`).toLocaleTimeString('en-US', { timeStyle: 'short', timeZone: 'UTC' })}
                {endTime && (startTime ? ' to ' : ' Until ')}
                {endTime && new Date(`1970-01-01T${endTime}Z`).toLocaleTimeString('en-US', { timeStyle: 'short', timeZone: 'UTC' })}
              </p>
            )
          }
          {
            location && (
              <p className={styles['icon-line']}>
                <PinIcon />
                {[location?.street_address, location?.city].filter((n) => n).join(', ')}
              </p>
            )
          }
        </div>

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

const datePropType = (props, propName, componentName) => {
  if (!props[propName]) return undefined;
  if (!/\d{4}-\d{2}-\d{2}/.test(props[propName])) {
    return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected string of form YYYY-MM-DD.`);
  }
  return undefined;
};

const timePropType = (props, propName, componentName) => {
  if (!props[propName]) return undefined;
  if (!/\d{2}:\d{2}:\d{2}/.test(props[propName])) {
    return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected string of form HH:MM:SS.`);
  }
  return undefined;
};

ResourceCard.propTypes = {
  name: PropTypes.string.isRequired,
  organization: PropTypes.string,

  startDate: datePropType,
  endDate: datePropType,
  startTime: timePropType,
  endTime: timePropType,

  flyer: PropTypes.string,
  location: PropTypes.shape({
    street_address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip_code: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
};

ResourceCard.defaultProps = {
  organization: null,
  startDate: null,
  endDate: null,
  startTime: null,
  endTime: null,
  flyer: null,
  location: null,
};

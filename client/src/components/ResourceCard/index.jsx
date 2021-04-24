import React from 'react';
import { RESOURCE_PROP_TYPES, RESOURCE_DEFAULT_PROPS } from 'data/resources';
import styles from './ResourceCard.module.scss';

import Link from 'next/link';

import ClockIcon from '../../../public/clock.svg';
import PinIcon from '../../../public/pin.svg';
import CalendarIcon from '../../../public/calendar.svg';
import ViewIcon from '../../../public/view.svg';
import Calendar2Icon from '../../../public/calendar2.svg';
import ShareIcon from '../../../public/share.svg';

import { slugify } from 'utils';


export default function ResourceCard({
  id, name, organization, startDate, endDate, location, flyer, startTime, endTime,
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

        <Link href="/resources/[id]" as={`/resources/${id}-${slugify(name, 5)}`}>
          <a className={styles.cta}>
            View more
            <ViewIcon />
          </a>
        </Link>

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

ResourceCard.propTypes = RESOURCE_PROP_TYPES;
ResourceCard.defaultProps = RESOURCE_DEFAULT_PROPS;

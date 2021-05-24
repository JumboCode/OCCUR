import React from 'react';
import { RESOURCE_PROP_TYPES, RESOURCE_DEFAULT_PROPS } from 'data/resources';
import styles from './ResourceCard.module.scss';

import Link from 'next/link';
import { DateRange, TimeRange } from 'components/DateRange';
import CalendarEventDownload from 'components/CalendarEventDownload';

import ClockIcon from '../../../public/clock.svg';
import PinIcon from '../../../public/pin.svg';
import CalendarIcon from '../../../public/calendar.svg';
import ViewIcon from '../../../public/view.svg';
import Calendar2Icon from '../../../public/calendar2.svg';
import ShareIcon from '../../../public/share.svg';

import { slugify } from 'utils';


export default function ResourceCard({
  id,
  name,
  organization,
  category,
  startDate,
  endDate,
  location: resourceLocation,
  flyer,
  startTime,
  endTime,
  isRecurring,
  recurrenceDays,
}) {
  const defaultImage = `/images/category-defaults/${category || 'OTHER'}.jpeg`;
  return (
    <div className={styles.base}>
      <div className={styles.leftside}>
        <img alt="Resource flyer" src={flyer || defaultImage} />
      </div>

      <div className={styles.rightside}>
        <div className={styles.content}>
          <h3>{name}</h3>
          {organization && <p className={styles.subtitle}>{organization}</p>}
          { (startDate || endDate) && (
            <p className={styles['icon-line']}>
              <CalendarIcon />
              <DateRange from={startDate} to={endDate} />
            </p>
          )}
          {
            (startTime || endTime) && (
              <p className={styles['icon-line']}>
                <ClockIcon />
                <TimeRange from={startTime} to={endTime} />
              </p>
            )
          }
          {
            resourceLocation && (
              <p className={styles['icon-line']}>
                <PinIcon />
                {[resourceLocation?.street_address, resourceLocation?.city]
                  .filter((n) => n).join(', ')}
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
          <CalendarEventDownload
            name={name}
            startTime={startTime}
            endTime={endTime}
            startDate={startDate}
            endDate={endDate}
            isRecurring={isRecurring}
            recurrenceDays={recurrenceDays}
            location={resourceLocation}
          >
            <Calendar2Icon />
            Add to Calendar
          </CalendarEventDownload>
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

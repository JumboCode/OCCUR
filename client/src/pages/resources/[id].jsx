import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { RESOURCE_PROP_TYPES } from 'data/resources';

import api, { HTTPError } from 'api';
import { formatPhoneNumber, slugify } from 'utils';

import Map from 'components/Map/lazy';
import NotFound from 'pages/404';
import Error from 'next/error';
import { DateRange, TimeRange } from 'components/DateRange';

import ArrowIcon from '../../../public/view.svg';
import Calendar2Icon from '../../../public/calendar2.svg';
import ShareIcon from '../../../public/share.svg';

import styles from './ResourceDetail.module.scss';


export default function ResourcePage({
  errorCode,
  data: {
    id,
    name,
    organization,
    flyer,

    startDate,
    endDate,
    startTime,
    endTime,
    location,
    description,

    link,

    location: resourceLocation,
    meetingLink,
    phone,
    email,
  },
}) {
  const router = useRouter();

  if (errorCode === 404) return <NotFound />;
  if (errorCode !== null) return <Error statusCode={errorCode} />;

  return (
    <div className={styles.base}>
      <button
        type="button"
        className={styles.backButton}
        onClick={router.back}
      >
        <ArrowIcon style={{ transform: 'rotate(180deg)' }} />
        Back
      </button>

      <div className={styles.columns}>
        <div className={styles.main}>
          <div className={styles.mainColumns}>
            <div className={styles.logo} style={flyer && { backgroundImage: `url(${flyer})` }} />
            <div>
              <div className={styles.basic}>
                <h1>{name}</h1>
                {organization && (
                  <div className={styles.subhead} style={{ fontWeight: 400 }}>
                    <span style={{ fontWeight: 600 }}>Run by:</span>
                    &nbsp;
                    {organization}
                  </div>
                )}
              </div>
              <div className={styles.logistics}>
                {(startDate || endDate) && (
                  <p>
                    <b>Date:</b>
                    &nbsp;
                    <DateRange from={startDate} to={endDate} />
                  </p>
                )}
                {(startTime || endTime) && (
                  <p>
                    <b>Time:</b>
                    &nbsp;
                    <TimeRange from={startTime} to={endTime} />
                  </p>
                )}
                {
                  location && (
                    <p>
                      <b>Location:</b>
                      &nbsp;
                      {[location?.street_address, location?.city].filter((n) => n).join(', ')}
                    </p>
                  )
                }
              </div>
            </div>
          </div>
          {description && (
            <div className={styles.eventcontainer}>
              <h2>Event Details:</h2>
              <p className={styles.paragraph}>
                {description}
              </p>
            </div>
          )}
        </div>
        <div className={styles.rightColumn}>
          {link && (
            <div className={styles.buttongroup}>
              <a className={styles.rightbutton} href={link}>
                <img alt="more info button" src="/moreinfo.png" />
                More Information
              </a>
            </div>
          )}
          <div className={styles.buttongroup}>
            <div className={styles.rightbutton}>
              <Calendar2Icon />
              Add to Calendar
            </div>
            <div className={styles.rightbutton}>
              <ShareIcon />
              Share
            </div>
          </div>
          <div className={styles.contact}>
            <h3>Address and Contact Information</h3>
            {resourceLocation.street_address && (
              <p className={styles.address}>
                {/* TODO: replace location name */}
                Location Name
                <br />
                {resourceLocation.street_address}
                <br />
                {resourceLocation.city}
                {', '}
                {resourceLocation.state}
                {' '}
                {resourceLocation.zip_code}
              </p>
            )}
            <p className={styles.contactDetails}>
              {meetingLink && (
                <>
                  <a href={meetingLink}>{meetingLink}</a>
                  <br />
                </>
              )}
              {phone && (
                <>
                  <a href={`tel:${phone}`}>{formatPhoneNumber(phone)}</a>
                  <br />
                </>
              )}
              {email && (
                <a href={`mailto:${email}`}>{email}</a>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.map}>
        <Map resources={[{ id, name, location }]} />
      </div>
    </div>
  );
}
ResourcePage.propTypes = {
  errorCode: PropTypes.number,
  data: PropTypes.shape(RESOURCE_PROP_TYPES),
};
ResourcePage.defaultProps = { errorCode: null, data: null };

export async function getServerSideProps(ctx) {
  const [id, ...slug] = ctx.query.id.toLowerCase().split('-');
  // Non-numeric IDs should generate 404 without even making a request
  if (!/^\d+$/.test(id)) return { props: { errorCode: 404 } };

  // Look for resource by ID and handle errors
  let data;
  try {
    data = await api.get(`resources/${id}`);
  } catch (e) {
    let status = 500; // handle errors as 500 by default
    if (e instanceof HTTPError && e.status === 404) status = 404; // but 404 if resource not found
    ctx.res.statusCode = status;
    return { props: { errorCode: status } };
  }

  // Make sure slug (if it was provided) matches resource title
  const titleSlug = slugify(data.name).split('-');
  for (let i = 0; i < slug.length; i += 1) {
    if (slug[i] !== titleSlug[i]) {
      ctx.res.statusCode = 404;
      return { props: { errorCode: 404 } };
    }
  }

  return { props: { data } };
}

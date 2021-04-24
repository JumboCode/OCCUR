import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import Link from 'next/link';
import NotFound from 'pages/404';
import Error from 'next/error';

import ArrowIcon from '../../../public/view.svg';
import Calendar2Icon from '../../../public/calendar2.svg';
import ShareIcon from '../../../public/share.svg';

import api, { HTTPError } from 'api';

import styles from './ResourceDetail.module.scss';
import { slugify } from 'utils';


export default function ResourcePage({ errorCode, data }) {
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
            <div className={styles.logo} />
            <div>
              <div className={styles.basic}>
                <h1>Oakland Food Drive</h1>
                <div className={styles.subhead} style={{ fontWeight: 400 }}>
                  <span style={{ fontWeight: 600 }}>Run by:</span>
                  &nbsp;
                  OCCUR
                </div>
              </div>
              <div className={styles.logistics}>
                <p>
                  <b>Date:</b>
                  &nbsp;
                  Friday, March 17 2021
                </p>
                <p>
                  <b>Time:</b>
                  &nbsp;
                  8:00 AM to 5:00 PM PST
                </p>
                <p>
                  <b>Location:</b>
                  &nbsp;
                  Alameda Food Bank
                </p>
              </div>
            </div>
          </div>
          <div className={styles.eventcontainer}>
            <h2>Event Details:</h2>
            <p className={styles.paragraph}>
              This space is reserved for a paragraph about the resource or
              community offering that either OCCUR or the Oakland
              community will offer. It will be a space that touches on
              more details like if they will provide PPE, what the
              requirements will be at the scene of the event, and anything else
              the organization wants to share with the public!
            </p>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.buttongroup}>
            <div className={styles.rightbutton}>
              <Link className={styles.moreinfo} href="/">
                <a>
                  <img alt="more info button" src="/moreinfo.png" />
                </a>
              </Link>
              More Information
            </div>
          </div>
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
            <p className={styles.address}>
              Alameda Food Bank
              <br />
              214 N. Maple Dr
              <br />
              Oakland, CA 92144
              <br />
              US
            </p>
            <p className={styles.contactDetails}>
              <a href="tel:19245543459">(924) 554-3459</a>
              <br />
              <a href="mailto:name@email.com">name@email.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
ResourcePage.propTypes = {
  errorCode: PropTypes.number,
  data: PropTypes.shape({
    // TODO:
  }),
};
ResourcePage.defaultProps = { errorCode: null, data: null };

export async function getServerSideProps(ctx) {
  const [id, ...slug] = ctx.query.id.toLowerCase().split('-');
  // Non-numeric IDs should generate 404 without even making a request
  if (!/^\d+$/.test(id)) return { props: { errorCode: 404 } };

  // Look for resource by ID and handle errors
  let data;
  try {
    data = await api.get(`/${id}/resource`);
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

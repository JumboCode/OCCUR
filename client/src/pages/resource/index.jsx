import React from 'react';
import styles from './ResourcePage.module.scss';
import ArrowIcon from '../../../public/view.svg';
import Link from 'next/link';
import Calendar2Icon from '../../../public/calendar2.svg';
import ShareIcon from '../../../public/share.svg';
import { useRouter } from 'next/router';

export default function ResourcePage() {
  const router = useRouter();

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

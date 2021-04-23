import React from 'react';
import styles from './ResourcePage.module.scss';
import ArrowIcon from '../../../public/view.svg';
import Link from 'next/link';
import Calendar2Icon from '../../../public/calendar2.svg';
import ShareIcon from '../../../public/share.svg';

export default function ResourcePage() {
  return (
    <div className={styles.base}>
      <div className={styles.main}>
        <div className={styles.mainColumns}>
          <div className={styles.logo} />
          <div>
            <div className={styles.basic}>
              <h1>Oakland Food Drive</h1>
              <h2 className={styles.ranbyoccur}>Run by: Occur</h2>
            </div>
            <div className={styles.logistics}>
              <p>
                <b>Date:</b>
                Friday, March 17 2021
              </p>
              <p>
                <b>Time:</b>
                8:00 AM to 5:00 PM PST
              </p>
              <p>
                <b>Location:</b>
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

      <div className={styles.backColumn}>
        <ArrowIcon style={{ transform: 'rotate(180deg)' }} />
        Back
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.rightbuttons}>
          <Link className={styles.moreinfo} href="/">
            <a>
              <img alt="more info button" src="/moreinfo.png" />
            </a>
          </Link>
          More Information
        </div>
        <div style={{ display: 'flex' }}>
          <div className={styles.rightbuttons}>
            <Calendar2Icon />
            Add to Calendar
          </div>

          <div className={styles.rightbuttons}>
            <ShareIcon />
            Share Button
          </div>
        </div>

        <div className={styles.contact}>
          <p className={styles.address}>Address and Contact Information</p>
          <p className={styles.address2}>
            <br />
            Alameda Food Bank
            <br />
            214 N. Maple Dr
            <br />
            Oakland, CA 92144
            <br />
            US
          </p>
          <p className={styles.phoneNumber}>
            (924) 554-3459
            <br />
            name@email.com
          </p>
        </div>
      </div>
    </div>
  );
}

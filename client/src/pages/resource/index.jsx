import React from 'react';
import PropTypes from 'prop-types';
import styles from './ResourcePage.module.scss';
import MaybeLink from '../../components/MaybeLink';
import ViewIcon from '../../../public/view.svg';
import Link from 'next/link';
import Calendar2Icon from '../../../public/calendar2.svg';
import ShareIcon from '../../../public/share.svg';


export default function ResourcePage({href, as, imageSrc }) {
  return (
    <div className={styles.base}>
      <div className={styles.main}>
        <div className={styles.mainColumns}>
          <div className={styles.logo} style={imageSrc && { backgroundImage: `url()` }} />
          <div>
            <div className={styles.basic}>
              <h1>Oakland Food Drive</h1>
              <h2>Run by: Occur</h2>
            </div>
            <div className={styles.logistics}>
              <p>Date: Friday, March 17 2021</p>
              <p>Time: 8:00 AM to 5:00 PM PST</p>
              <p>Location: Alameda Food Bank</p>
            </div>
          </div>
        </div>

        <div className={styles.eventcontainer}>
          <h2>Event Details:</h2>
          <p>
            This space is reserved for a paragraph about the resource
            or community offering that either OCCUR or the Oakland community will offer.
            It will be a space that touches on more details like if they will provide
            PPE, what the requirements will be at the scene of the event, and anything
            else the organization wants to share with the public!
          </p>
        </div>
      </div>

      <div className={styles.aside1}>
        <div className={styles.arrow}>
          <MaybeLink href={href} as={as} className={styles.cta}>
            <ViewIcon />
          </MaybeLink>
        </div>
        Back
      </div>

      <div className={styles.aside2}>
      <div className={styles.rightbuttons}>
        <ShareIcon />
        More Information
      </div>
      <div style={{ display: 'flex' }}>
        <div className={styles.rightbuttons}>
          <Calendar2Icon />
          Add to Calendar
        </div>

      <div className={styles.rightbuttons}>
        <ShareIcon/>
        Share Button
      </div>
      </div>

      <div className={styles.rightbuttons}>
        <p className={styles.address}>
          360 14th Street
          <br />
          Ste 100
          <br />
          Oakland, CA 94612
          <br />
          US
        </p>
          <p className={styles.phoneNumber}>
            (510) 839 – 2440
          </p>
    
      </div>
    </div>
    </div>
    
  );
}

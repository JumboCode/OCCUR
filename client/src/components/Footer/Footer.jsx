import React from 'react';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <div className={styles.base}>
      <div>
        Join Our Email List
        <br />
        <br />
        Donate Today
      </div>

      <div>
        OCCUR Business Office
        <br />
        <br />
        <div className={styles.address}>
          360 14th Street
          <br />
          Ste 100
          <br />
          Oakland, CA 94612
          <br />
          US
        </div>
        <div className={styles.phoneNumber}>
          (510) 839 – 2440
        </div>
        <br />
        <br />
        <br />
        <br />
        <div className={styles.logo}>
          <img className={styles.logo} src="/images/OCCUR_logo.png" alt="OCCUR" />
        </div>
      </div>

      <div>
        Contact Us
        <div className={styles.icons}>
          <img className={styles.icon} src="/images/facebook_icon.png" alt="Facebook" />
          <img className={styles.icon} src="/images/twitter_icon.png" alt="Twitter" />
          <img className={styles.icon} src="/images/linkedin_icon.png" alt="Linkedin" />
          <img className={styles.icon} src="/images/instagram_icon.png" alt="Instagram" />
        </div>
      </div>
    </div>
  );
}
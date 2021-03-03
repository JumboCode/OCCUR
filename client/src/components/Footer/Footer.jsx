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

          <a href="https://www.facebook.com/occurnow/" target="_blank">
            <img className={styles.icon} src="/images/facebook.svg" alt="Facebook" />
          </a>
          <a href="https://twitter.com/occur_now" target="_blank">
            <img className={styles.icon} src="/images/twitter.svg" alt="Twitter" />
          </a>
          <a href="https://www.linkedin.com/company/occurorg/" target="_blank">
            <img className={styles.icon} src="/images/linkedin.svg" alt="Linkedin" />
          </a>
          <a href="https://www.instagram.com/occurnow/" target="_blank">
            <img className={styles.icon} src="/images/instagram.svg" alt="Instagram" />
          </a>
        </div>
      </div>
    </div>
  );
}
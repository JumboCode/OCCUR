import React from 'react';
import styles from './Footer.module.scss';

import FacebookIcon from '../../../public/icons/facebook.svg';
import InstagramIcon from '../../../public/icons/instagram.svg';
import LinkedinIcon from '../../../public/icons/linkedin.svg';
import TwitterIcon from '../../../public/icons/twitter.svg';

export default function Footer() {
  return (
    <div className={styles.base}>
      <div className={styles.columns}>
        <div>
          <p>Join Our Email List</p>
          <p>Donate Today</p>
        </div>
        <div>
          <p>OCCUR Business Office</p>
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
        <div>
          Contact Us
          <div className={styles.icons}>
            <a href="https://www.facebook.com/occurnow/" target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
            </a>
            <a href="https://twitter.com/occur_now" target="_blank" rel="noopener noreferrer">
              <TwitterIcon />
            </a>
            <a href="https://www.linkedin.com/company/occurorg/" target="_blank" rel="noopener noreferrer">
              <LinkedinIcon />
            </a>
            <a href="https://www.instagram.com/occurnow/" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.logo}>
        <img className={styles.logo} src="/images/OCCUR_logo.png" alt="OCCUR" />
      </div>
    </div>
  );
}

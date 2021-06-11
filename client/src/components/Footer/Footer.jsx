import React from 'react';
import styles from './Footer.module.scss';

import Link from 'next/link';

import FacebookIcon from '../../../public/icons/facebook.svg';
import InstagramIcon from '../../../public/icons/instagram.svg';
import LinkedinIcon from '../../../public/icons/linkedin.svg';
import TwitterIcon from '../../../public/icons/twitter.svg';

export default function Footer() {
  return (
    <div className={styles.base}>
      <div className={styles.columns}>
        <div>
          <p style={{ cursor: 'not-allowed' }}>Join Our Email List</p>
          <p>
            <a href="https://donorbox.org/occur" target="_blank" rel="noopener noreferrer">Donate Today</a>
          </p>
          <p>
            <Link href="/credits"><a>Credits</a></Link>
          </p>
        </div>
        <div>
          <p>OCCUR Business Office</p>
          <p className={styles.address}>
            360 14th Street, Ste 100
            <br />
            Oakland, CA 94612
          </p>
          <a className={styles.phoneNumber}>
            (510) 839-2440
          </a>
        </div>
        <div>
          <p>
            <a href="https://www.occurnow.org/contact" target="_blank" rel="nooopener noreferrer">Contact Us</a>
          </p>
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

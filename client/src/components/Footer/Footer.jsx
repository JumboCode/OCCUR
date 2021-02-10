import React from 'react';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <div className={styles.base}>
      <div>another child</div>

      <div className={styles.address}>
        OCCUR Business Office
        <br />
        360 14th Street
        <br />
        Ste 100
        <br />
        Oakland, CA 94612
        <br />
        US
        <br />
        (510) 839 – 2440
        <br />
      </div>

      <div>third child</div>
    </div>
  );
}
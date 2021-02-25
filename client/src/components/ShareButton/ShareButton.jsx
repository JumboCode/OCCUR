import React, { useState } from 'react';
import styles from './ShareButton.module.scss';

import FacebookIcon from '../../../public/icons/logo-facebook.svg';
import TwitterIcon from '../../../public/icons/logo-twitter.svg';
import InstagramIcon from '../../../public/icons/logo-instagram.svg';
import LinkedinIcon from '../../../public/icons/logo-linkedin.svg';

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);

  const openWindow = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.base}>
      <button type="button" onClick={openWindow}>
        Share
      </button>

      {
        isOpen
          ? (
            <div className={styles.shareIcons}>
              <span className={styles.facebook}><FacebookIcon /></span>
              <span className={styles.twitter}><TwitterIcon /></span>
              <span className={styles.instagram}><InstagramIcon /></span>
              <span className={styles.linkedin}><LinkedinIcon /></span>
            </div>
          )
          : null
      }
    </div>
  );
}

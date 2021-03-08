import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ShareButton.module.scss';

import FacebookIcon from '../../../public/icons/logo-facebook.svg';
import TwitterIcon from '../../../public/icons/logo-twitter.svg';
import LinkedinIcon from '../../../public/icons/logo-linkedin.svg';

export default function ShareButton({ url }) {
  const [isOpen, setIsOpen] = useState(false);

  const openWindow = () => {
    setIsOpen(!isOpen);
  };

  const encodedURL = encodeURIComponent(url);
  return (
    <div className={styles.base}>
      <button type="button" onClick={openWindow}>
        Share
      </button>

      {
        isOpen
          ? (
            <div className={styles.shareIcons}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.facebook.com/dialog/feed?app_id=447289576469469&display=page&link=${encodedURL}`}
                className={styles.facebook}
              >
                <FacebookIcon />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://twitter.com/intent/tweet?url=${encodedURL}`}
                className={styles.twitter}
              >
                <TwitterIcon />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`}
                className={styles.linkedin}
              >
                <LinkedinIcon />
              </a>
            </div>
          )
          : null
      }
    </div>
  );
}
ShareButton.propTypes = {
  url: PropTypes.string.isRequired,
};

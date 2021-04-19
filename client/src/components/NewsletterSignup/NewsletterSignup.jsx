import React from 'react';
import styles from './NewsletterSignup.module.scss';

const NewsletterSignup = () => (
  <form className={styles.searchbar} action="/" method="get">
    <input
      type="text"
      id="header-search"
      placeholder="Enter email..."
      name="s"
    />
    <button className={styles.searchbutton} type="submit">
      <p>Sign Up</p>
    </button>

  </form>
);

export default NewsletterSignup;

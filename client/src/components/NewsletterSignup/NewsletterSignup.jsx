import React from 'react';
import styles from './NewsletterSignup.module.scss';

const NewsletterSignup = () => (
  <form className={styles.searchbar} onSubmit={(e) => { e.preventDefault(); /* TODO: submit */ }}>
    <input
      type="email"
      placeholder="Enter email"
    />
    <button className={styles.searchbutton} type="submit">
      <p>Sign Up</p>
    </button>

  </form>
);

export default NewsletterSignup;

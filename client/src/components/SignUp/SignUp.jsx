import React from 'react';
import styles from './SignUp.module.scss';
import SearchIcon from '../../../public/glass.svg';


const SignUp = () => (
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

export default SignUp;

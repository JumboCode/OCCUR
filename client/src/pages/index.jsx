import jwtDecode from 'jwt-decode';
import React from 'react';

import { doLogin, useAuth } from '../auth';
import styles from './homepage.module.scss';
import Fists from '../../public/images/fists_on_screen.svg';
import People_at_computer from '../../public/images/people_at_screen.svg';
import Person_at_computer from '../../public/images/person_at_computer.svg';

export default function Home() {
  const auth = useAuth();

  return (
    <div className = {styles.base}>
      <div className = {styles.searchBanner}>
        <div className = {styles.peopleComputer}>
          <People_at_computer />
        </div>
      </div>
      <div className = {styles.mission}>
        <h4>
          Our Mission
        </h4>
        <p>
          OCCUR is committed to creating capacity building 
          opportunities to support the well-being, economic development, and 
          civic inclusion of marginzalized communities.
        </p>
        <div className={styles.fists}>
          <Fists />
        </div>
      </div>
      <div className = {styles.resources}>
        Resources
      </div>
      <div className = {styles.donate}>
        Donate
      </div>
      <div className = {styles.contact}>
        Contact Us
        <Person_at_computer />
      </div>

    </div>
  );
}

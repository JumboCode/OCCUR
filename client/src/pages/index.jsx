import React from 'react';

import styles from './homepage.module.scss';
import SearchBar from '../components/SearchBar/SearchBar';
// import Fists from '../../public/images/illustrations/fists_on_screen.png';
// import People_at_computer from '../../public/images/illustrations/people_at_laptop.png';
// import Person_at_computer from '../../public/images/illustrations/person_at_computer.png';

export default function Home() {
  return (
    <div className = {styles.base}>
      <div className = {styles.searchBanner}>
        <img className={styles.peopleComputer} src="/images/illustrations/people_at_laptop.png" />
        <div className = {styles.searchBar}>
          <SearchBar/>
        </div>
      </div>
      <div className = {styles.mission}>
        <h4>
          Our Mission
        </h4>
        <p>
          OCCUR is committed to creating capacity building 
          opportunities to support the well&#8209;being, economic development, and 
          civic inclusion of marginzalized communities.
        </p>
        <img className={styles.fists} src="/images/illustrations/fists_on_screen.png" />
      </div>
      <div className = {styles.resources}>
        <h5>
          OCCUR Resources Happening Soon
        </h5>
        <h5>
          Free Wifi Hotspots Near Oakland
        </h5>
      </div>
      <div className = {styles.donate}>
        <h4>
          Please Support Our Efforts
        </h4>
        <p>
          Your generous support enables OCCUR to continue to provide
          effective capacity building programs and services.
        </p>
        <div className = {styles.donateButton}>
          <p> Donate Today </p>
        </div>
      </div>
      <div className = {styles.contact}> 
        <h4>
          Stay Connected: Join the OCCUR Newsletter Today
        </h4>
        <div className = {styles.signup}>
        <img className={styles.personComputer} src="/images/illustrations/person_at_computer.png" />
        </div>
        <div className = {styles.contactButton}>
          <p> Contact Us </p>      
        </div>
      </div>
    </div>
  );
}

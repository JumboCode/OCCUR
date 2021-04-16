import React from 'react';

import styles from './homepage.module.scss';
import SearchBar from '../components/SearchBar/SearchBar';
import SignUp from '../components/SignUp/SignUp';
import WordBubble from '../../public/images/word_bubble.svg';

export default function Home() {
  return (
    <div className = {styles.base}>

      <div className = {styles.searchBanner}>
        <img className={styles.peopleComputer} src="/images/illustrations/people_at_laptop.png" />
        <div className = {styles.searchBar}>
          <div className={styles.wordBubble}>
            <WordBubble/>
          </div>
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

      <div className = {styles.donate}>
        <h4>
          Please Support Our Efforts
        </h4>
        <p>
          Your generous support enables OCCUR to continue to provide
          effective capacity building programs and services.
        </p>
        <a href="https://donorbox.org/occur">
          <div className ={styles.donateButton} >
              <p> Donate Today </p>
          </div>
        </a>
      </div>

      <div className = {styles.contact}> 
        <h4>
          Stay Connected: Join the OCCUR Newsletter Today
        </h4>
        <div className = {styles.signup}>
          <img className={styles.personComputer} src="/images/illustrations/person_at_computer.png" />
          <div className = {styles.signupBtn}>
            <SignUp/>
          </div>
        </div>
        <a href="https://occurnow.org/contact-us-1">  
        <div className = {styles.contactButton}>
          <p> Contact Us </p>      
        </div>
        </a>
      </div>

    </div>
  );
}

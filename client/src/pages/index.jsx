import React from 'react';

import styles from './homepage.module.scss';
import SearchBar from '../components/SearchBar/SearchBar';
import SignUp from '../components/NewsletterSignup/NewsletterSignup';
import WordBubble from '../../public/images/word_bubble.svg';

export default function Home() {
  return (
    <div className={styles.base}>

      <section className={styles.searchBanner}>
        <img className={styles.peopleComputer} src="/images/illustrations/people_at_laptop.png" alt="People sitting around a laptop" />
        <div className={styles.searchBar}>
          <div className={styles.wordBubble}>
            <WordBubble />
          </div>
          <SearchBar />
        </div>
      </section>

      <section className={styles.mission}>
        <h4>
          Our Mission
        </h4>
        <p>
          OCCUR is committed to creating capacity building
          opportunities to support the well&#8209;being, economic development, and
          civic inclusion of marginzalized communities.
        </p>
        <img className={styles.fists} src="/images/illustrations/fists_on_screen.png" alt="A laptop screen displaying three raised fists." />
      </section>

      <section className={styles.donate}>
        <h4>
          Please Support Our Efforts
        </h4>
        <p>
          Your generous support enables OCCUR to continue to provide
          effective capacity building programs and services.
        </p>
        <a href="https://donorbox.org/occur" className={styles.button}>
          Donate Today
        </a>
      </section>

      <section className={styles.contact}>
        <h4>
          Stay Connected: Join the OCCUR Newsletter Today
        </h4>
        <div className={styles.signup}>
          <img className={styles.personComputer} src="/images/illustrations/person_at_computer.png" alt="A woman sitting at a computer" />
          <div className={styles.signupBtn}>
            <SignUp />
          </div>
        </div>
        <a href="https://occurnow.org/contact" className={styles.button}>
          Contact Us
        </a>
      </section>

    </div>
  );
}

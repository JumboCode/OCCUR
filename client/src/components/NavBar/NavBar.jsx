import React from 'react';
import styles from './NavBar.module.scss';
import SearchBar from '../SearchBar/SearchBar.jsx';
import Link from 'next/link';


export default function NavBar() {
  return (
    <nav className={styles.base}>
      <Link href="/"><a className={styles.logo}><img alt="OCCUR logo" src="/logo.png" /></a></Link>

      <SearchBar />
      <Link href="/"><a>Home</a></Link>
      <Link href="/resources"><a>Resources</a></Link>
      <a>Wifi Hotspot</a>
      <a>Contact</a>
    </nav>
  );
}

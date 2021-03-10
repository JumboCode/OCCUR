import React from 'react';
import styles from './Header.module.scss';
import SearchBar from '../SearchBar/SearchBar.jsx';
import Link from 'next/link';


export default function Header() {
  return (
    <nav className={styles.navbar}>
      <Link href="/"><a className={styles.logo}><img alt="OCCUR logo" src="/logo.png" /></a></Link>

      <SearchBar />
      <Link href="/"><a>Home</a></Link>
      <a>Resources</a>
      <a>Wifi Hotspot</a>
      <a>Contact</a>
    </nav>
  );
}

import React from 'react';
import styles from './Header.module.scss';
import SearchBar from '../SearchBar/SearchBar.jsx';
import Link from 'next/link';


export default function Header() {
  return (
    <nav className={styles.navbar}>
      <img className={styles.logo} src="/logo.png" />

      <SearchBar />
      <Link href="/"><a>Home</a></Link>
      <a>Resources</a>
      <a>Wifi Hotspot</a>
      <a>Contact</a>
    </nav>
  );
}

import React from 'react';
import styles from './NavBar.module.scss';
import SearchBar from '../SearchBar/SearchBar.jsx';
import Link from 'next/link';
import { useAuth } from 'auth';


export default function NavBar() {
  const { isAuthenticated } = useAuth();
  return (
    <nav className={styles.base}>
      <Link href="/"><a className={styles.logo}><img alt="OCCUR logo" src="/logo.png" /></a></Link>

      <SearchBar live />
      <Link href="/"><a>Home</a></Link>
      <Link href="/resources"><a>Resources</a></Link>
      <a>Wifi Hotspot</a>
      {
        isAuthenticated
          ? (
            <>
              {/* Links that only display for authenticated users */}
              <a>Admin Manager</a>
            </>
          )
          : (
            <>
              {/* Links that only display for unauthenticated users */}
              <a href="https://occurnow.org/contact">Contact</a>
            </>
          )
      }
    </nav>
  );
}

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

      <SearchBar />
      <Link href="/"><a>Home</a></Link>
      <Link href="/resources"><a>Resources</a></Link>
      <a>Wifi Hotspot</a>
      {
        isAuthenticated
          ? (
            <>
              {/* Links that only display for authenticated users */}
              <Link href="/admin/manager"><a>Admin Manager</a></Link>
            </>
          )
          : (
            <>
              {/* Links that only display for unauthenticated users */}
              <a>Contact</a>
            </>
          )
      }
    </nav>
  );
}

import React, { useState } from 'react';
import styles from './NavBar.module.scss';
import SearchBar from '../SearchBar/SearchBar.jsx';
import Link from 'next/link';
import { useAuth } from 'auth';
import Burger from './Burger';
import ModalNavMenu from 'components/ModalNavMenu'
import { nominalTypeHack } from 'prop-types';


export default function NavBar() {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.base}>
      <Link href="/"><a className={styles.logo}><img alt="OCCUR logo" src="/logo.png" /></a></Link>

      <div className={styles.innernav}>
      <SearchBar live />
      {/* <button onclick= {() => setMenuOpen(true)}> */}
      <Burger classname={styles.burger} />
      {/* </button> */}
      </div>
      
      <ModalNavMenu className={styles.ModalNavMenu} isopen={menuOpen} close={setMenuOpen} isAuthenticated={isAuthenticated}/>

      <Link href="/"><a>Home</a></Link>
      <Link href="/resources"><a>Resources</a></Link>
      <Link href={{ pathname: '/resources', query: { categories: 'WIFI' } }}>
        <a>Wifi Hotspot</a>
      </Link>
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
              <a href="https://occurnow.org/contact">Contact</a>
            </>
          )
      }
    </nav>
  );
}

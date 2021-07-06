import React, { useState } from 'react';
import styles from './NavBar.module.scss';
import SearchBar from '../SearchBar/SearchBar.jsx';
import Link from 'next/link';
import { useAuth } from 'auth';
import Close from '../../../public/icons/close.svg';
import Burger from './Burger';

function MobileMenu(isopen, setMenuOpen, isAuthenticated) {
  return (
    <div className={isopen ? styles.openMenu : styles.closeMenu}>
      <Close className={styles.close} type="button" onClick={() => setMenuOpen(false)} />
      <ul>
        <li><Link href="/"><a role="button" tabIndex={0} onClick={() => setMenuOpen(false)} onKeyDown={() => setMenuOpen(false)}>Home</a></Link></li>
        <li><Link href="/resources"><a role="button" tabIndex={0} onClick={() => setMenuOpen(false)} onKeyDown={() => setMenuOpen(false)}>Resources</a></Link></li>
        <li><Link href={{ pathname: '/resources', query: { categories: 'WIFI' } }}><a role="button" tabIndex={0} onClick={() => setMenuOpen(false)} onKeyDown={() => setMenuOpen(false)}>Wifi Hotspot</a></Link></li>
        <li>
          {
            isAuthenticated
              ? (
                <>
                  {/* Links that only display for authenticated users */}
                  <Link href="/admin/manager"><a role="button" tabIndex={0} onClick={() => setMenuOpen(false)} onKeyDown={() => setMenuOpen(false)}>Admin Manager</a></Link>
                </>
              )
              : (
                <>
                  {/* Links that only display for unauthenticated users */}
                  <a href="https://occurnow.org/contact" role="button" tabIndex={0} onClick={() => setMenuOpen(false)} onKeyDown={() => setMenuOpen(false)}>Contact</a>
                </>
              )
          }
        </li>
      </ul>
    </div>
  );
}

export default function NavBar() {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.base}>
      <Link href="/"><a className={styles.logo}><img alt="OCCUR logo" src="/logo.png" /></a></Link>
      <SearchBar live />
      <Burger classname={styles.burger} handleClick={() => setMenuOpen(true)} />
      {MobileMenu(menuOpen, setMenuOpen, isAuthenticated)}
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

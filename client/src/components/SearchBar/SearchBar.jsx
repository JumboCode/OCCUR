import React, { useState } from 'react';
import Link from 'next/link';
import styles from './SearchBar.module.scss';
import SearchIcon from '../../../public/glass.svg';


function SearchBar() {
  const [text, setText] = useState('');

  return (
    <div className={`searchbar ${styles.searchbar}`}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        id="header-search"
        placeholder="Search for resources..."
        name="s"
      />

      <Link href={{ pathname: '/resources', query: { search: text } }}>
        <a className={styles.searchbutton}>
          <SearchIcon />
        </a>
      </Link>
    </div>
  );
}

export default SearchBar;

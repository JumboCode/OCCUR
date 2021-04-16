import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from './SearchBar.module.scss';
import SearchIcon from '../../../public/glass.svg';


function SearchBar() {
  const [text, setText] = useState('');
  const router = useRouter();

  const go = useCallback(() => {
    router.push({ pathname: '/resources', query: text ? { search: text } : undefined });
  }, [text]);

  return (
    <div className={`searchbar ${styles.searchbar}`}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search for resources..."
        name="s"
      />

      <button type="button" className={styles.searchbutton} onClick={go}>
        <SearchIcon />
      </button>
    </div>
  );
}

export default SearchBar;

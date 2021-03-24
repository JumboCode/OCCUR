import React from 'react';
import styles from './SearchBar.module.scss';
import SearchIcon from '../../../public/glass.svg';


function SearchBar() {
  return (
    <div className={`searchbar ${styles.searchbar}`}>
      <input
        type="text"
        id="header-search"
        placeholder="Search for resources..."
        name="s"
      />

      <a className={styles.searchbutton}>
        <SearchIcon />
      </a>
    </div>
  );
}

export default SearchBar;

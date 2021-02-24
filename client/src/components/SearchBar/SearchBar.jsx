import React from 'react';
import styles from './SearchBar.module.scss';
import SearchIcon from '../../../public/glass.svg';


const SearchBar = () => (
  <form className={styles.searchbar} action="/" method="get">
    <input
      type="text"
      id="header-search"
      placeholder="Search for resources..."
      name="s"
    />
    <button className={styles.searchbutton} type="submit">
      <SearchIcon />
    </button>

  </form>
);

export default SearchBar;

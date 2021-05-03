import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import SearchIcon from '../../../public/glass.svg';
import styles from './SearchBar.module.scss';


function SearchBar({ live }) {
  const [stateText, setStateText] = useState('');
  const router = useRouter();

  const isLive = live && router.pathname === '/resources';
  const text = isLive ? (router.query.search || '') : stateText;

  // If we're already on the search page this function can just update the search shallowly instead
  // of re-navigating
  const updateSearch = useCallback((search) => {
    if (router.pathname === '/resources') {
      const { search: oldSearch, ...currentQuery } = router.query;
      router.push({
        pathname: '/resources',
        query: { ...currentQuery, ...search && { search } },
      }, undefined, { shallow: true });
      return true;
    }
    return false;
  }, [router]);

  const go = useCallback(() => {
    const didShallowUpdate = updateSearch(text);
    if (!didShallowUpdate) {
      router.push({ pathname: '/resources', query: text ? { search: text } : undefined });
    }
  }, [text, router, updateSearch]);

  return (
    <div className={`searchbar ${styles.searchbar}`}>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          const didUpdateLive = isLive && updateSearch(e.target.value);
          if (!didUpdateLive) setStateText(e.target.value);
        }}
        placeholder="Search for resources..."
        name="s"
      />

      <button type="button" className={styles.searchbutton} onClick={go}>
        <SearchIcon />
      </button>
    </div>
  );
}
SearchBar.propTypes = { live: PropTypes.bool };
SearchBar.defaultProps = { live: false };

export default SearchBar;

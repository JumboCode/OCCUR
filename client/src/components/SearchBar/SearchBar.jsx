import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import SearchIcon from '../../../public/glass.svg';
import styles from './SearchBar.module.scss';


function SearchBar({ live }) {
  const [text, setText] = useState('');
  const router = useRouter();

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

  // In “live” mode, if we're already on the resources page, update the query as the user types.
  useEffect(() => {
    if (!live) return;
    updateSearch(text);
  }, [text, live]);

  const go = useCallback(() => {
    const didShallowUpdate = updateSearch(text);
    if (!didShallowUpdate) {
      router.push({ pathname: '/resources', query: text ? { search: text } : undefined });
    }
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
SearchBar.propTypes = { live: PropTypes.bool };
SearchBar.defaultProps = { live: false };

export default SearchBar;

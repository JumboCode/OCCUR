import React from 'react';
import PropTypes from 'prop-types';
import styles from './Burger.module.scss';

export default function Burger({ handleClick }) {
  return (
    <div role="button" tabIndex={0} className={styles.styledburger} onClick={handleClick} onKeyDown={handleClick}>
      <div className={styles.top} />
      <div className={styles.middle} />
      <div className={styles.bottom} />
    </div>
  );
}

Burger.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

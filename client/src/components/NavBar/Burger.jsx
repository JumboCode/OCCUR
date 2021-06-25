import React from 'react';
import PropTypes from 'prop-types';
// import RightNav from './RightNav';
import styles from './Burger.module.scss';


export default function Burger ({ handleClick }){ 

  return (
      <button type='button' className={styles.styledburger} onClick={handleClick}>
        <div className={styles.top} />
        <div className={styles.middle} />
        <div className={styles.bottom} />
      </button>      
  );
};


Burger.propTypes = {
  handleClick : PropTypes.func.isRequired,
}
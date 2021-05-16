import React, { useState } from 'react';
import RightNav from './RightNav';
import styles from './Burger.module.scss';


const Burger = () => {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-trailing-spaces
  
  return (
    <React.Fragment open={open} onClick={() => setOpen(!open)}>
      <div className={styles.styledburger}>
        <div />
        <div />
        <div />
      </div>
      
    </React.Fragment>
  );
};

export default Burger;
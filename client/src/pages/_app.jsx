import React from 'react';
import PropTypes from 'prop-types';

import 'styles/base.scss';
import styles from './app.module.scss';

export default function AppContainer({ Component, pageProps }) {
  return (
    <div className={styles.base}>
      <Component {...pageProps} />
    </div>
  );
}

AppContainer.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import Footer from 'components/Footer/Footer.jsx';

import { AuthProvider } from '../auth';

import 'styles/base.scss';
import styles from './app.module.scss';
import Header from 'components/Header/header.jsx';

export default function AppContainer({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Header />
      <div className={styles.container}>
        <Component {...pageProps} />
      </div>
      <Footer />
    </AuthProvider>
  );
}

AppContainer.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import { Auth0Provider } from '@auth0/auth0-react';

import 'styles/base.scss';
import styles from './app.module.scss';

export default function AppContainer({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      redirectUri={process.env.NEXT_PUBLIC_BASE_URL}
    >
      <div className={styles.base}>
        <Component {...pageProps} />
      </div>
    </Auth0Provider>
  );
}

AppContainer.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

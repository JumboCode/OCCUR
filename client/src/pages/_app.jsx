import React from 'react';
import PropTypes from 'prop-types';
import { Auth0Provider } from '@auth0/auth0-react';

export default function AppContainer({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain="occur.us.auth0.com"
      clientId="OUr5pR1GCGKp7krFCbcZ1SwkxZLwTYo8"
      redirectUri={process.env.NEXT_PUBLIC_BASE_URL}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  );
}

AppContainer.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

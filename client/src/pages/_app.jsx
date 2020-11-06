import React from 'react';
import PropTypes from 'prop-types';

export default function AppContainer({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}

AppContainer.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

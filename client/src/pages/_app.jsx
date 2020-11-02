import React from 'react';
import PropTypes from 'prop-types';

export default function AppContainer({ Component }) {
  return (
    <div>
      Secret message
      <Component />
    </div>
  );
}

AppContainer.propTypes = {
  Component: PropTypes.node.isRequired,
};

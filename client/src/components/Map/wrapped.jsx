import React from 'react';
import PropTypes from 'prop-types';
import Map from './Map';

const WrappedMap = ({ customRef, ...props }) => <Map ref={customRef} {...props} />;
WrappedMap.propTypes = { customRef: PropTypes.shape({ current: PropTypes.any }) }; // eslint-disable-line react/forbid-prop-types, max-len
WrappedMap.defaultProps = { customRef: undefined };
export default WrappedMap;

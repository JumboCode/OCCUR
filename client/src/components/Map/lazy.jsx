import React, { forwardRef } from 'react';

import dynamic from 'next/dynamic';

const WrappedMap = dynamic(() => import('./wrapped.jsx'));

export default forwardRef((props, ref) => <WrappedMap {...props} customRef={ref} />);

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

import styles from './Modal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function Modal({ open, onClose, children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const baseRef = useRef(null);

  return mounted
    ? createPortal(
      <div
        className={cx('base', { open })}
        ref={baseRef}
        onClick={(e) => {
          if (e.target === baseRef.current) onClose();
        }}
        role="none"
      >
        <div className={cx('window')}>{children}</div>
      </div>,
      document.body,
    )
    : null;
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

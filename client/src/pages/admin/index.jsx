import React from 'react';

import AdminLogin from 'components/AdminLogin';

import styles from './index.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function AdminHome() {
  return (
    <div className={cx('base')}>
      <AdminLogin />
    </div>
  );
}

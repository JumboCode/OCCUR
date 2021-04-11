import React, { useState, useCallback } from 'react';

import { doLogin } from 'auth';

import styles from './AdminLogin.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const login = useCallback(() => {
    doLogin(email)
      .then(() => {
        setErrorMessage(null);
      })
      .catch((err) => {
        if (['bad.email', 'bad.connection'].includes(err?.code)) setErrorMessage('Please enter a valid email');
        else {
          console.error('Error sending passwordless login link:', err); // eslint-disable-line no-console
          setErrorMessage('Something went wrong');
        }
      });
  }, [email]);

  return (
    <div className={cx('base')}>
      <h1>Admin Login</h1>
      <div className={cx('error', { hidden: !errorMessage })}>
        {errorMessage}
      </div>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
      <button type="button" onClick={login}>
        Log in
      </button>
    </div>
  );
}

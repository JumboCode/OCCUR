import React, { useState, useCallback } from 'react';

import { doLogin } from 'auth';

import styles from './AdminLogin.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [sentEmail, setSentEmail] = useState(false);

  const login = useCallback(() => {
    doLogin(email)
      .then(() => {
        setErrorMessage(null);
        setSentEmail(true);
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
      {
        !sentEmail
          ? (
            <>
              <h1>Admin Login</h1>
              <div className={cx('error', { hidden: !errorMessage })}>
                {errorMessage}
              </div>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
              <button type="button" className={cx('login-button')} onClick={login}>
                Log in
              </button>
            </>
          )
          : (
            <>
              <h1>Check your email!</h1>
              <div className={cx('message')}>
                Email confirmation sent to
                <br />
                <i>{email}</i>
              </div>
              <div className={cx('message', 'small')}>
                Didn’t receive an email?
                <button type="button" className={cx('reset-button')} onClick={() => setSentEmail(false)}>
                  Click to resend
                </button>
              </div>
            </>
          )
      }
    </div>
  );
}

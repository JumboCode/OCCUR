import React, { useState, useCallback } from 'react';

import { useAuth } from 'auth';

import EmailIllustration from '../../../public/images/email-illustration.svg';
import EmailIcon from '../../../public/icons/email.svg';

import styles from './AdminLogin.module.scss';
import classNames from 'classnames/bind';
import { useRouter } from 'next/router';

const cx = classNames.bind(styles);

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [sentEmail, setSentEmail] = useState(false);

  const { isAuthenticated, ready: authReady, login, logout, identity } = useAuth();
  const router = useRouter();

  const doLogin = useCallback(() => {
    login(email)
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

  const doLogout = useCallback(() => {
    logout();
    router.push('/');
  });

  // Login page 1: enter email address and send email
  const page1 = (
    <form onSubmit={(e) => { e.preventDefault(); doLogin(); }}>
      <h1>Admin Login</h1>
      <div className={cx('error', { hidden: !errorMessage })}>
        {errorMessage}
      </div>
      <div className={cx('input-group')}>
        <EmailIcon />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
      </div>
      <button type="submit" className={cx('login-button')} disabled={!authReady}>
        Log in
      </button>
    </form>
  );

  // Login page 2: Instructions for once you're done with that
  const page2 = (
    <>
      <h1 style={{ marginBottom: '0.5em' }}>Check your email!</h1>
      <EmailIllustration className={cx('illustration')} />
      <div className={cx('message')} style={{ marginTop: '1em' }}>
        Email confirmation sent to
        <br />
        <i>{email}</i>
      </div>
      <div className={cx('message', 'small')} style={{ marginTop: '2em' }}>
        Didn’t receive an email?
        <button type="button" className={cx('reset-button')} onClick={() => setSentEmail(false)}>
          Click to resend
        </button>
      </div>
    </>
  );

  const loginInterface = (!sentEmail ? page1 : page2);
  const logoutInterface = (
    <>
      <h1 style={{ marginBottom: 0 }}>Welcome</h1>
      <p className={cx('message')} style={{ marginBottom: 0 }}>
        You’re logged in as
        {' '}
        {identity?.name}
      </p>
      <button type="button" className={cx('login-button')} onClick={doLogout} disabled={!authReady}>
        Log out
      </button>
    </>
  );

  return (
    <div className={cx('base')}>
      {!isAuthenticated ? loginInterface : logoutInterface}
    </div>
  );
}

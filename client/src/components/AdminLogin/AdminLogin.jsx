import React, { useState, useCallback } from 'react';

import { doLogin } from 'auth';

import EmailIllustration from '../../../public/images/email-illustration.svg';
import EmailIcon from '../../../public/icons/email.svg';

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
          // First page: enter email address and send email
          ? (
            <>
              <h1>Admin Login</h1>
              <div className={cx('error', { hidden: !errorMessage })}>
                {errorMessage}
              </div>
              <div className={cx('input-group')}>
                <EmailIcon />
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
              </div>
              <button type="button" className={cx('login-button')} onClick={login}>
                Log in
              </button>
            </>
          )
          // Instructions for once you're done with that
          : (
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
          )
      }
    </div>
  );
}

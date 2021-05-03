/* eslint-disable no-console */
import React, { useState, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import Cookies from 'js-cookie'; // cookies for browser
import cookie from 'cookie'; // cookies for node

import jwtDecode from 'jwt-decode';

/* eslint-disable import/prefer-default-export */

export const AuthContext = React.createContext({});
export const useAuth = () => useContext(AuthContext);

/* The Auth0Provider is a component that should wrap the entire app. It stores and tends to tokens
 * and credentials, and it provides auth information to the entire component tree through the
 * Context API. */
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const isAuthenticated = !!accessToken;
  const [idToken, setIdToken] = useState(null);

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('id_token');
    setAccessToken(null);
    setIdToken(null);
  };

  // Grab access token from localStorage and check if expired
  useEffect(() => {
    const tok = accessToken || JSON.parse(Cookies.get('access_token') ?? null);
    if (tok) {
      // Parse token
      let expired = false;
      try {
        const { exp } = jwtDecode(tok);
        expired = exp * 1000 < Date.now();
      } catch (e) { expired = true; } // If we can't parse token, treat that like it's expired
      // Token expired; log out
      if (expired) {
        console.log('Logging out...');
        logout();
      }
      // If the token is not expired and we don't already have one in state, we should store it.
      if (!accessToken && !expired) {
        setAccessToken(tok);
        setIdToken(JSON.parse(Cookies.get('id_token') ?? null));
      }
    }
  }, [accessToken]);

  // On the client: dynamic import auth0-js and create a webAuth object
  const [webAuth, setWebAuth] = useState(null);
  useEffect(() => {
    // IIFE because useEffect function can't return promise
    (async () => {
      const auth0 = await import('auth0-js');
      setWebAuth(new auth0.WebAuth({
        clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
        domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
        redirectUri: process.env.NEXT_PUBLIC_BASE_URL,
        responseType: 'token id_token',
        audience: 'occur-api',
      }));
    })();
  }, []);

  // Parse hash from URL and store result. This should only run once we initialize auth0 on the
  // client.
  useEffect(() => {
    if (!webAuth) return; // Don't run until we've set webAuth to a truthy value
    const { hash } = window.location;
    if (hash.startsWith('#access_token=') || hash.startsWith('#error=')) {
      console.log('Attempting login...');
      webAuth.parseHash({ hash }, (err, authResult) => {
        if (err) console.error(err);
        else {
          console.log('Got authResult with accessToken', authResult.accessToken);
          // Record auth result
          setAccessToken(authResult.accessToken);
          setIdToken(authResult.idToken);
          // cookies expire in a week (the token expires long before this)
          Cookies.set('access_token', JSON.stringify(authResult.accessToken), { expires: 7, secure: true });
          Cookies.set('id_token', JSON.stringify(authResult.idToken), { expires: 7, secure: true });
        }
      });
      // Remove visible hash from URL
      window.history.replaceState({}, document.title, '.');
    }
  }, [webAuth]);

  // Login method
  const login = (email) => new Promise((resolve, reject) => {
    webAuth.passwordlessStart({
      connection: 'email',
      send: 'link',
      email,
    }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  return (
    <AuthContext.Provider
      value={{
        ready: !!webAuth,

        isAuthenticated,
        accessToken,
        idToken,
        identity: useMemo(() => idToken && jwtDecode(idToken), [idToken]),

        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
AuthProvider.propTypes = { children: PropTypes.node.isRequired };


/* Use isAdmin in a getServerSideProps function to limit it to authenticated admin users. */
export function isAdmin(ctx) {
  const cookies = cookie.parse(ctx.req.headers.cookie);
  const token = cookies.access_token;
  let expired;
  if (token) {
    const { exp } = jwtDecode(token);
    expired = exp * 1000 < Date.now();
  }
  return !(!token || expired);
}

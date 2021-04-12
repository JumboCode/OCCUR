/* eslint-disable no-console */
import React, { useState, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import jwtDecode from 'jwt-decode';

/* eslint-disable import/prefer-default-export */

export const AuthContext = React.createContext({});
export const useAuth = () => useContext(AuthContext);

// The Auth0 Provider can manage and retrieve auth state and provide it to children via Context
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const isAuthenticated = !!accessToken;
  const [idToken, setIdToken] = useState(null);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    setAccessToken(null);
    setIdToken(null);
  };

  // Grab access token from localStorage and check if expired
  useEffect(() => {
    const tok = accessToken || JSON.parse(localStorage.getItem('access_token'));
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
        setIdToken(JSON.parse(localStorage.getItem('id_token')));
      }
    }
  });

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
          localStorage.setItem('access_token', JSON.stringify(authResult.accessToken));
          localStorage.setItem('id_token', JSON.stringify(authResult.idToken));
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

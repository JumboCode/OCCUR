import auth0 from 'auth0-js';

export const webAuth = new auth0.WebAuth({
  clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  redirectUri: process.env.NEXT_PUBLIC_BASE_URL,
  responseType: 'token id_token',
  audience: 'occur-api',
});

/* eslint-disable import/prefer-default-export */

export function doLogin(email) {
  webAuth.passwordlessStart({
    connection: 'email',
    send: 'link',
    email,
  }, (err) => {
    if (err) console.error('Error sending passwordless link:', err);
  });
}

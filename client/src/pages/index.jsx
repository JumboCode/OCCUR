import jwtDecode from 'jwt-decode';
import React from 'react';

import { doLogin, useAuth } from '../auth';

export default function Home() {
  const auth = useAuth();

  return (
    <div>
      <button type="button" onClick={() => doLogin('luke@deentaylor.com')}>
        Click me
      </button>
      <div>
        User
        {auth.idToken ? ` '${jwtDecode(auth.idToken).nickname}' ` : ' '}
        is
        {auth.isAuthenticated ? ' ' : ' not '}
        authenticated
      </div>
    </div>

  );
}

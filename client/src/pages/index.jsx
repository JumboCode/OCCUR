import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { doLogin } from '../auth';

export default function Home() {
  const auth = useAuth0();
  return (
    <div>
      Hello, world!
      <button type="button" onClick={() => doLogin('luke@deentaylor.com')}>
        Click me
      </button>
      <div>
        User is
        {auth.isAuthenticated ? ' ' : ' not '}
        authenticated
      </div>
    </div>
  );
}

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const auth = useAuth0();

  return (
    <div>
      Hello, world!
      <button type="button" onClick={() => auth.loginWithRedirect()}>
        Click me
      </button>
    </div>
  );
}

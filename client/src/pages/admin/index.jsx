import React, { useState, useCallback } from 'react';

import { doLogin } from 'auth';

export default function Home() {
  const [email, setEmail] = useState('');

  const login = useCallback(() => {
    doLogin(email)
      .then(() => console.log('email sent'))
      .catch((e) => console.error(e));
  }, [email]);

  return (
    <div>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
      <button type="button" onClick={login}>
        Log in
      </button>
    </div>
  );
}

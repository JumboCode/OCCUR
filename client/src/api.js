import { useMemo } from 'react';
import { useAuth } from 'auth';

const BASE_PATH = process.env.NEXT_PUBLIC_API_BASE ?? 'https://api.resources.occurnow.org/';

export class HTTPError extends Error {
  constructor(response, body) {
    super(response.statusText || `Error ${response.status}`);

    if (Error.captureStackTrace) Error.captureStackTrace(this, HTTPError);

    this.name = 'HTTPError';
    this.status = response.status;
    this.body = body;
  }
}

/* Low-level interface: make a request to the given path/parameters using the given method and
 * the given body/authorization. Light wrapper around the `fetch` API. */
export async function makeRequest(method, path, params = {}, body, token) {
  const url = new URL(
    // Strip leading slash off of path
    path.startsWith('/') ? path.substring(1) : path,
    BASE_PATH,
  );
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) throw new HTTPError(response, await response.json());
  return response.json();
}

/* Get authenticated API functions for a given access token */
export function getApi(token) {
  // Methods with no body
  const [getf, deletef] = ['get', 'delete']
    .map((method) => (path, params) => makeRequest(method, path, params, undefined, token));
  // Methods with body
  const [postf, putf, patchf] = ['post', 'put', 'patch']
    .map((method) => (path, params, body) => makeRequest(method, path, params, body, token));

  return {
    get: getf,
    post: postf,
    put: putf,
    patch: patchf,
    delete: deletef,
  };
}

/* React hook to get authenticated API functions using the token from context */
export function useApi() {
  const { ready, isAuthenticated, accessToken } = useAuth();
  const token = (ready && isAuthenticated) ? accessToken : undefined;

  const methods = useMemo(() => getApi(token), [token]);
  return {
    ...methods,
    authenticated: ready && isAuthenticated,
  };
}


export default {
  // Only get request runs unauthenticated
  get: (path, params) => makeRequest('get', path, params),
  post: (path, params) => makeRequest('post', path, params),
  // useApi and getApi return an authenticated suite of functions
  useApi, // get authenticated methods for use inside a React component
  getApi, // get authenticated methods for use in the server-side case

  request: makeRequest,
};

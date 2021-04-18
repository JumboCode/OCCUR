import { useAuth } from 'auth';

const BASE_PATH = process.env.NEXT_PUBLIC_API_BASE ?? 'https://api.resources.occurnow.org/api/v1/';

export async function makeRequest(method, path, params = {}, body, token) {
  const url = new URL(
    // Strip leading slash off of path
    path.startsWith('/') ? path.substring(1) : path,
    BASE_PATH,
  );
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  const response = await fetch(url, {
    method,
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.json();
}

export function getReq(path, params, token = null) {
  return makeRequest('get', path, params, undefined, token);
}

export function postReq(path, params, body, token = null) {
  return makeRequest('post', path, params, body, token);
}

export function putReq(path, params, body, token = null) {
  return makeRequest('put', path, params, body, token);
}

// TODO: add PATCH

export function deleteReq(path, params, token = null) {
  return makeRequest('delete', path, params, undefined, token);
}

/* Hook to get a full suite of API functions that automatically pass auth token */
export function useApi() {
  const { ready, isAuthenticated, accessToken } = useAuth();
  const tokenParam = (ready && isAuthenticated) ? accessToken : undefined;
  const [getFunc, postFunc, putFunc, deleteFunc] = [getReq, postReq, putReq, deleteReq]
    .map((func) => (...args) => func(...args, tokenParam));
  return {
    // API methods
    get: getFunc,
    post: postFunc,
    put: putFunc,
    delete: deleteFunc,
    // Info
    authenticated: ready && isAuthenticated,
  };
}

export default {
  useApi,

  get: getReq,
  post: postReq,
  put: putReq,
  delete: deleteReq,

  request: makeRequest,
};

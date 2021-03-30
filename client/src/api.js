const BASE_PATH = process.env.NEXT_PUBLIC_API_BASE ?? 'http://occur-backend.herokuapp.com/api/v1/';

export async function makeRequest(method, path, params = {}, body) {
  const url = new URL(
    // Strip leading slash off of path
    path.startsWith('/') ? path.substring(1) : path,
    BASE_PATH,
  );
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  const response = await fetch(url, {
    method,
    body,
  });
  return response.json();
}

export function get(path, params) {
  return makeRequest('get', path, params);
}

export function post(path, params, body) {
  return makeRequest('post', path, params, body);
}

export function put(path, params, body) {
  return makeRequest('put', path, params, body);
}

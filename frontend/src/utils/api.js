import { getDeviceType } from './platform.js';
import { isNullOrUndefined } from './type.js';
import { getURLWithUTMParams } from './url.js';

export function searchParams(params, transformArray = false) {
  const entries = Object.entries(params).filter(
    ([, v]) => !isNullOrUndefined(v)
  );
  return entries
    .map(([key, value]) => {
      if (transformArray && Array.isArray(value)) {
        return value.map((v) => `${key}[]=${String(v)}`).join('&');
      }
      return `${key}=${String(value)}`;
    })
    .join('&');
}

export class ApiError extends Error {
  constructor(message, response, json) {
    super(message);
    this.name = 'ApiError';
    this.isFromServer = true;
    this.response = response;
    this.responseJson = json;
  }
}

export async function parseJsonResponse(response) {
  let json;
  try {
    json = await response.json();
  } catch {
    // ignore invalid or empty JSON
  }

  if (response.headers.has('X-Flash-Messages')) {
    const flashHeader = response.headers.get('X-Flash-Messages') || '{}';
    const { error, notice } = JSON.parse(flashHeader) || {};
    if (error || notice) {
      const flashError = error || notice;
      if (json && typeof json === 'object') {
        Object.assign(json, { flashError });
      } else {
        json = { flashError };
      }

      if (error) {
        window.GTMtracker?.pushEvent({
          event: 'gtm_custom_click',
          data: { click_text: error, click_type: 'Flash error' }
        });
      }
    }
  }

  if (response.ok) return json;
  throw new ApiError(response.statusText, response, json);
}

export async function apiRequest(method, path, body = null, options = {}) {
  const deviceType = getDeviceType();
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');

  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Accept-Flash': 'true',
    'App-Name': deviceType,
    ...(csrfMeta ? { 'X-CSRF-Token': csrfMeta.content } : {})
  };

  const defaultOptions = { method };

  if (options.dataType === 'FormData') {
    delete defaultHeaders['Content-Type'];
    defaultOptions.body = body;
  } else if (body && method !== 'GET') {
    defaultOptions.body = JSON.stringify(body);
  }

  const { headers, params, ...remainingOptions } = options;
  const finalOptions = {
    ...defaultOptions,
    headers: { ...defaultHeaders, ...(headers || {}) },
    credentials: 'same-origin',
    ...remainingOptions
  };
  finalOptions.referrer = getURLWithUTMParams();

  if (params) {
    path += `?${searchParams(params)}`;
  } else if (method === 'GET' && body && typeof body === 'object') {
    path += `?${searchParams(body, true)}`;
  }

  const response = await fetch(path, finalOptions);
  return parseJsonResponse(response);
}

export async function generateJWT() {
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  let token;
  try {
    const headers = {
      'Content-Type': 'text/plain',
      'X-Requested-With': 'XMLHttpRequest',
      ...(csrfMeta?.content ? { 'X-CSRF-Token': csrfMeta.content } : {})
    };
    const response = await fetch('/generate-jwt', {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });
    if (!response.ok) throw new Error(String(response.status));
    token = await response.text();
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw error;
  }
  return token;
}

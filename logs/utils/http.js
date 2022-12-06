import { addOauthHeader } from '@clevercloud/client/cjs/oauth.node.js';
import { prefixUrl } from '@clevercloud/client/cjs/prefix-url.js';
import { withCache } from '@clevercloud/client/cjs/with-cache.js';
import { withOptions } from '@clevercloud/client/cjs/with-options.js';
import fetch from 'node-fetch';

const JSON_TYPE = 'application/json';
const FORM_TYPE = 'application/x-www-form-urlencoded';

export function sendToApi ({ apiConfig = {}, signal, cacheDelay, timeout }) {

  return (requestParams) => {

    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {

      const { API_HOST = 'https://api.clever-cloud.com', ...tokens } = apiConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl(API_HOST))
        .then(addOauthHeader(tokens))
        .then(withOptions({ signal, timeout }))
        .then(request);
    });
  };
}

function formatBody (requestParams) {
  if (requestParams.headers['Content-Type'] === JSON_TYPE && typeof requestParams.body !== 'string') {
    return JSON.stringify(requestParams.body);
  }
  if (requestParams.headers['Content-Type'] === FORM_TYPE && typeof requestParams.body !== 'string') {
    const qs = new URLSearchParams();
    Object.entries(requestParams.body).forEach(([name, value]) => qs.set(name, value));
    return qs.toString();
  }

  return requestParams.body;
}

function getContentType (headers) {
  const contentType = headers.get('Content-Type');
  return contentType != null ? contentType.split(';')[0] : contentType;
}

function parseResponseBody (response) {
  const contentType = getContentType(response.headers);

  if (contentType === JSON_TYPE) {
    return response.json();
  }

  if (contentType === FORM_TYPE) {
    return response.text().then((text) => {
      const responseObject = {};
      Array.from(new URLSearchParams(text).entries())
        .forEach(([name, value]) => {
          responseObject[name] = value;
        });
      return responseObject;
    });
  }

  return response.text();
}

async function request (requestParams) {
  const url = new URL(requestParams.url);
  Object.entries(requestParams.queryParams || {}).forEach(([k, v]) => url.searchParams.set(k, v));
  const body = formatBody(requestParams);
  const response = await fetch(url.toString(), {
    ...requestParams,
    body,
    mode: 'cors',
  });

  if (response.status >= 400) {
    const responseBody = await parseResponseBody(response);
    const errorMessage = responseBody.message != null ? responseBody.message : responseBody;
    const error = new Error(errorMessage);

    if (responseBody.id != null) {
      error.id = responseBody.id;
    }

    error.response = response;
    error.responseBody = responseBody;
    throw error;
  }

  if (response.status === 204) {
    return;
  }

  return parseResponseBody(response);
}

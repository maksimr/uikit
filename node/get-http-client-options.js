import { parse } from 'url';
import { getProxyAgent } from './get-proxy-agent.js';

/**
 * @param {string} urlStr 
 * @param {string} [proxy]
 * @param {boolean} [strictSSL]
 * @param {string} [authorization]
 * @returns {import('http').RequestOptions & import('https').RequestOptions}
 */
export function getHttpClientOptions(urlStr, proxy, strictSSL, authorization) {
  const url = parse(urlStr);
  const agent = getProxyAgent(urlStr, proxy, strictSSL);

  /**@type {import('http').RequestOptions & import('https').RequestOptions}*/
  const options = {
    host: url.hostname,
    path: url.path,
    agent: agent
  };

  if (url.protocol === 'https:') {
    options.rejectUnauthorized = isBoolean(strictSSL) ? strictSSL : true;
  }

  if (authorization) {
    options.headers = Object.assign(options.headers || {}, { 'Proxy-Authorization': authorization });
  }

  return options;
}

/**
 * @param {any} obj 
 * @returns {obj is boolean}
 */
function isBoolean(obj) {
  return obj === true || obj === false;
}
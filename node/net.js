/**
 * @param {string} urlStr 
 * @param {string} [proxy]
 * @param {boolean} [strictSSL]
 * @param {string} [authorization]
 * @returns {import('http').RequestOptions & import('https').RequestOptions}
 */
function getHttpClientOptions(urlStr, proxy, strictSSL, authorization) {
  const url = require('url').parse(urlStr);
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
 * @param {string} requestUrl 
 * @param {string} [proxy]
 * @param {boolean} [strictSSL]
 * @returns {import('http').Agent | import('https').Agent | undefined}
 */
function getProxyAgent(requestUrl, proxy, strictSSL) {
  const proxyURL = proxy || getSystemProxyURL(requestUrl);

  if (!proxyURL || !/^https?:/.test(requestUrl)) {
    return undefined;
  }

  const ProxyAgent = requestUrl.startsWith('http:') ?
    require('http-proxy-agent').HttpProxyAgent :
    require('https-proxy-agent').HttpsProxyAgent;

  return new ProxyAgent(proxyURL, {
    rejectUnauthorized: isBoolean(strictSSL) ? strictSSL : true
  });
}

/**
 * @param {string} requestUrl 
 * @returns {string | undefined}
 */
function getSystemProxyURL(requestUrl) {
  if (requestUrl.startsWith('http:')) {
    return process.env.HTTP_PROXY || process.env.http_proxy || undefined;
  } else if (requestUrl.startsWith('https:')) {
    return process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || undefined;
  }
  return undefined;
}

/**
 * @param {any} obj 
 * @returns {obj is boolean}
 */
function isBoolean(obj) {
  return obj === true || obj === false;
}

module.exports.getHttpClientOptions = getHttpClientOptions;
module.exports.getProxyAgent = getProxyAgent;
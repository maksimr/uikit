/**
 * @param {string} requestUrl 
 * @param {string} [proxy]
 * @param {boolean} [strictSSL]
 * @returns {import('http').Agent | import('https').Agent | undefined}
 */
export function getProxyAgent(requestUrl, proxy, strictSSL) {
  const proxyURL = proxy || getSystemProxyURL(requestUrl);

  if (!proxyURL || !/^https?:/.test(requestUrl)) {
    return undefined;
  }

  const ProxyAgent = requestUrl.startsWith('http:') ?
    require('http-proxy-agent').HttpProxyAgent :
    require('https-proxy-agent').HttpsProxyAgent;

  return new ProxyAgent(proxyURL, {
    rejectUnauthorized: strictSSL ?? true
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
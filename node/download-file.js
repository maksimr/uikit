import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { getHttpClientOptions } from './get-http-client-options.js';

/**
 * @param {string} fileUrl 
 * @returns {Promise<import('http').IncomingMessage>}
 */
export function downloadFile(fileUrl) {
  const options = getHttpClientOptions(fileUrl, undefined, false);
  const httpClient = fileUrl.startsWith('http:') ?
    httpRequest :
    httpsRequest;

  return new Promise((resolve, reject) => {
    const request = httpClient(options, response => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        if (!response.headers.location) {
          return reject(new Error('Redirect status code, but no location header'));
        }

        // Redirect - download from new location
        return resolve(
          downloadFile(
            response.headers.location
          )
        );
      }

      if (response.statusCode !== 200) {
        // Download failed - print error message
        return reject(new Error(response.statusCode?.toString()));
      }

      resolve(response);
    });

    request.on('error', (/**@type {Error & {code?: string}}*/ error) => {
      reject(error);
    });

    request.end();
  });
}
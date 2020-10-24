/**
 * @param {string} matchPath
 * @param {string} path
 * @returns {{}|null}
 */
export function match(matchPath, path) {
  const parsedPath = pathToRegExp(matchPath);
  const m = parsedPath.regexp.exec(path);
  if (!m) {
    return null;
  }

  const params = {};
  for (let i = 1; i < m.length; i++) {
    const key = parsedPath.keys[i - 1];
    const value = m[i];
    if (key && value) {
      params[key.name] = value;
    }
  }
  return params;
}

/**
 * @param {string} path
 * @param {object} [params]
 * @returns {string}
 */
export function interpolate(path, params) {
  const result = [];
  (path || '').split(':').forEach(function(segment, i) {
    if (i === 0) {
      result.push(segment);
    } else {
      const segmentMatch = segment.match(/(\w+)(\*\?|[?*])?(.*)/);
      const key = segmentMatch[1];
      const {optional} = options(segmentMatch[2]);
      if (params.hasOwnProperty(key)) {
        result.push(params[key]);
      } else if (!optional) {
        throw Error(`URLError: "${path}" requires parameter "${key}"`);
      }
      result.push(segmentMatch[3] || '');
    }
  });
  return result.join('');
}

/**
 * @param {string} path
 * @param {{ignoreTrailingSlashes: boolean, caseInsensitiveMatch: boolean}} [opts]
 * @returns {{regexp: RegExp, keys: Array<{name: string, optional: boolean}>}}
 */
function pathToRegExp(path, opts = {
  ignoreTrailingSlashes: false,
  caseInsensitiveMatch: false
}) {
  /**
   * @type {Array<{name: string, optional: boolean}>}
   */
  const keys = [];
  let pattern = path
    .replace(/([().])/g, '\\$1')
    .replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function(_, slash, key, option) {
      const {optional, star} = options(option);
      slash = slash || '';
      keys.push({
        name: key,
        optional: optional
      });
      return (
        (optional ? '(?:' + slash : slash + '(?:') +
        (star ? '(.+?)' : '([^/]+)') +
        (optional ? '?)?' : ')')
      );
    })
    .replace(/([/$*])/g, '\\$1');

  if (opts.ignoreTrailingSlashes) {
    pattern = pattern.replace(/\/+$/, '') + '/*';
  }

  return {
    keys: keys,
    regexp: new RegExp(
      '^' + pattern + '(?:[?#]|$)',
      opts.caseInsensitiveMatch ? 'i' : ''
    )
  };
}

/**
 * @param {string} option
 * @returns {{star: boolean, optional: boolean}}
 */
function options(option) {
  const optional = option === '?' || option === '*?';
  const star = option === '*' || option === '*?';
  return {optional, star};
}

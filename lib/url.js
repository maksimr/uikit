/**
 * @param {string} matchPath Path template
 * @param {string} path Actual URI's path
 * @returns {Object<string,string>|null}
 */
export function matchPath(matchPath, path) {
  const parsedPath = pathToRegExp(matchPath);
  const m = parsedPath.regexp.exec(path);
  if (!m) {
    return null;
  }

  /**@type {Object<string,string>}*/
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
 * @template {string} T
 * @typedef {T extends `${infer RestPath}/${infer PathPart}` ? PathOf<RestPath> & PathOf<PathPart> : T extends `:${infer Param}?` ? Partial<PathOf<`:${Param}`>> : T extends `:${infer Param}*` ? PathOf<`:${Param}`> : T extends `:${infer Param}` ? { [key in Param]: string } : {}} PathOf
 */

/**
 * @template {string} T
 * @param {T} matchPath Path template
 * @param {PathOf<T>} [params]
 * @returns {string} URL path based on passed path template and parameters
 */
export function compilePath(matchPath, params) {
  /**@type {string[]}*/
  const result = [];
  (matchPath || '').split(':').forEach(function(segment, i) {
    if (i === 0) {
      result.push(segment);
    } else {
      const segmentMatch = segment.match(/(\w+)(\*\?|[?*])?(.*)/);
      if (segmentMatch === null) {
        return segment;
      }
      const key = segmentMatch[1];
      const { optional } = options(segmentMatch[2]);
      if (params && params.hasOwnProperty(key)) {
        result.push((/**@type {Record<String,string>}*/ (params))[key]);
      } else if (!optional) {
        throw Error(`URLError: "${matchPath}" requires parameter "${key}"`);
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
      const { optional, star } = options(option);
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
  return { optional, star };
}

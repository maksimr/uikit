/**
 * @description Selects an index in the specified array using the binary search algorithm.
 *  The evaluator receives an element and determines whether the desired index
 *  is before, at, or after it
 * @template T
 * @param {ArrayLike<T>} arr
 * @param {(it: T, index: number) => number} compareFn Evaluator function that receives 2 arguments (the element and the index).
 *  Should return a negative number, zero, or a positive number
 *  depending on whether the desired index is before, at, or after the
 *  element passed to it.
 * @returns {number} index of the search key, if it is contained in the array
 *  otherwise, <tt>(-(<i>insertion point</i>) - 1)</tt>.
 *  The <i>insertion point</i> is defined as the point at which the
 *  key would be inserted into the array
 */
export function binarySearch(arr, compareFn) {
  let min = 0;
  let max = arr.length;
  let found = false;
  while (min < max) {
    const middle = min + ((max - min) >>> 1);
    const compareResult = compareFn(arr[middle], middle);
    if (compareResult > 0) {
      min = middle + 1;
    } else {
      max = middle;
      found = !compareResult;
    }
  }
  return found ? min : -min - 1;
}

/**
 * @description Parses the accept language header and returns an array of locales sorted by quality value (q).
 * @param {string | null | undefined} value - The accept language header string.
 * @returns {string[]} - An array of locales sorted by quality value (q).
 */
export function parseAcceptLanguage(value) {
  value = value?.trim();
  if (!value) return [];

  /**@type {string[]}*/
  const sortedLanguages = [];

  /**@type {Map<string,number>}*/
  const langWeight = new Map();
  const langSep = ',';
  let nextFrom = 0;
  let nextTo = value.indexOf(langSep);
  while (nextFrom < value.length) {
    nextTo = nextTo > -1 ? nextTo : value.length;
    const from = nextFrom;
    const to = nextTo;
    nextFrom = to + 1;
    nextTo = value.indexOf(langSep, from);

    const language = value.slice(from, to).trim();

    const qSep = ';';
    const sepIndex = language.indexOf(qSep);
    const lang = sepIndex > -1 ? language.slice(0, sepIndex) : language;
    const q = parseQ(sepIndex > -1 ? language.slice(sepIndex + 1) : null);

    if (!lang || langWeight.has(lang)) {
      continue;
    }

    langWeight.set(lang, q);

    const index = binarySearch(sortedLanguages, (prevLang) => {
      const prevQ = langWeight.get(prevLang) ?? 1;
      return q > prevQ ? -1 : 1;
    });

    sortedLanguages.splice(~index, 0, lang);
  }

  return sortedLanguages;

  function parseQ(/**@type {string?}*/value) {
    if (!value) return 1;
    const parsedValue = /^q\s*=\s*(0(\.\d{1,3})?|1(\.0{1,3})?)$/.exec(value.trim());
    const qValueNumber = parsedValue ? Number(parsedValue[1]) : 1;
    return isNaN(qValueNumber) ? 1 : qValueNumber;
  }
}
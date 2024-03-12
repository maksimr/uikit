import { binarySearch } from './binary-search';

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

    const insertIdx = binarySearch(sortedLanguages, (prevLang) => {
      const prevQ = langWeight.get(prevLang) ?? 1;
      return q > prevQ ? -1 : 1;
    });

    sortedLanguages.splice(~insertIdx, 0, lang);
  }

  return sortedLanguages;

}

function parseQ(/**@type {string?}*/ value) {
  if (!value) return 1;
  const parsedValue = /^q\s*=\s*(0(\.\d{1,3})?|1(\.0{1,3})?)$/.exec(value.trim());
  const qValueNumber = parsedValue ? Number(parsedValue[1]) : 1;
  return isNaN(qValueNumber) ? 1 : qValueNumber;
}

import { binarySearch } from './util';

/**
 * @enum {number}
 */
export const TEXT_DIFF_OPERATION = {
  Delete: -1,
  Insert: 1,
  Equal: 0
};

/**
 * @typedef {[TEXT_DIFF_OPERATION, string]} TextDiff
 * @param {TEXT_DIFF_OPERATION} operation 
 * @param {string} value 
 * @returns {TextDiff}
 */
export function diffValue(operation, value) {
  return [operation, value];
}

/**
 * @param {string} text1 
 * @param {string} text2 
 * @returns {TextDiff[]}
 */
export function diff(text1, text2) {
  if (text1 === text2) {
    return text1 ? [diffValue(TEXT_DIFF_OPERATION.Equal, text1)] : [];
  }

  const commonPrefixLenght = getTextCommonPrefix(text1, text2);
  const commonPrefix = text1.substring(0, commonPrefixLenght);
  text1 = text1.substring(commonPrefixLenght);
  text2 = text2.substring(commonPrefixLenght);

  const commonSuffixLenght = getTextCommonSuffix(text1, text2);
  const commonSuffix = text1.substring(text1.length - commonSuffixLenght);
  text1 = text1.substring(0, text1.length - commonSuffixLenght);
  text2 = text2.substring(0, text2.length - commonSuffixLenght);

  const diffs = computeDiff(text1, text2);

  if (commonPrefix) {
    diffs.unshift(diffValue(TEXT_DIFF_OPERATION.Equal, commonPrefix));
  }

  if (commonSuffix) {
    diffs.push(diffValue(TEXT_DIFF_OPERATION.Equal, commonSuffix));
  }

  return diffs;
}

/**
 * 
 * @param {string} text1 
 * @param {string} text2 
 * @returns {TextDiff[]}
 */
function computeDiff(text1, text2) {
  /**@type {TextDiff[]}*/
  const diffs = [];

  if (!text1) {
    diffs.push(diffValue(TEXT_DIFF_OPERATION.Insert, text2));
    return diffs;
  }

  if (!text2) {
    diffs.push(diffValue(TEXT_DIFF_OPERATION.Delete, text1));
    return diffs;
  }

  const [longestText, shortestText] = text1.length > text2.length ? [text1, text2] : [text2, text1];
  const index = longestText.indexOf(shortestText);

  if (index !== -1) {
    const operation = text1.length > text2.length ? TEXT_DIFF_OPERATION.Delete : TEXT_DIFF_OPERATION.Insert;
    diffs.push(diffValue(operation, longestText.substring(0, index)));
    diffs.push(diffValue(TEXT_DIFF_OPERATION.Equal, shortestText));
    diffs.push(diffValue(operation, longestText.substring(index + shortestText.length)));
    return diffs;
  }

  if (shortestText.length === 1) {
    diffs.push(diffValue(TEXT_DIFF_OPERATION.Delete, text1));
    diffs.push(diffValue(TEXT_DIFF_OPERATION.Insert, text2));
    return diffs;
  }

  return diffBisect(text1, text2);
}

/**
 * @param {string} text1 
 * @param {string} text2 
 * @returns {TextDiff[]}
 */
function diffBisect(text1, text2) {
  const text1Length = text1.length;
  const text2Lenght = text2.length;
  const textDelta = text1Length - text2Lenght;

  const averageTextLength = Math.ceil((text1Length + text2Lenght) / 2);
  const vlenght = 2 * averageTextLength;
  const v1 = Array(vlenght).fill(-1);
  const v2 = Array(vlenght).fill(-1);

  let k1start = 0;
  let k1end = 0;
  let k2start = 0;
  let k2end = 0;
  for (let d = 0; d < averageTextLength; d++) {
    /**@type {TextDiff[]|void}*/
    let value;
    if (value = process(d, false)) return value;
    if (value = process(d, true)) return value;
  }

  return [
    diffValue(TEXT_DIFF_OPERATION.Delete, text1),
    diffValue(TEXT_DIFF_OPERATION.Insert, text2)
  ];

  /**
   * 
   * @param {number} d 
   * @param {boolean} reverse
   * @returns {TextDiff[]|void}
   */
  function process(d, reverse) {
    const front = textDelta % 2 !== 0;
    const v = reverse ? v2 : v1;
    const vr = reverse ? v1 : v2;
    for (let k = -d + (reverse ? k2start : k1start); k <= d - (reverse ? k2end : k1end); k += 2) {
      const kOffset = averageTextLength + k;
      /**@type {number}*/
      let x;
      if (k === -d || k !== d && v[kOffset - 1] < v[kOffset + 1]) {
        x = v[kOffset + 1];
      } else {
        x = v[kOffset - 1] + 1;
      }
      let y = x - k;
      while (
        x < text1Length && y < text2Lenght &&
        (
          reverse ?
            text1.charAt(text1Length - x - 1) === text2.charAt(text2Lenght - y - 1) :
            text1.charAt(x) === text2.charAt(y)
        )
      ) {
        x++;
        y++;
      }
      v[kOffset] = x;
      if (x > text1Length) {
        (reverse) ?
          k2end += 2 :
          k1end += 2;
      } else if (y > text2Lenght) {
        (reverse) ?
          k2start += 2 :
          k1start += 2;
      } else if (reverse ? !front : front) {
        const offset = averageTextLength + textDelta - k;
        if (offset >= 0 && offset < vlenght && vr[offset] !== -1) {
          if (reverse) {
            const x1 = vr[offset];
            const y1 = averageTextLength + x1 - offset;
            x = text1Length - x;
            if (x1 >= x) {
              return diffBisectSplit(text1, text2, x1, y1);
            }
          } else {
            const x2 = text1Length - vr[offset];
            if (x >= x2) {
              return diffBisectSplit(text1, text2, x, y);
            }
          }
        }
      }
    }
  }
}

/**
 * @param {string} text1 
 * @param {string} text2 
 * @param {number} x 
 * @param {number} y 
 * @returns {TextDiff[]}
 */
function diffBisectSplit(text1, text2, x, y) {
  const text1Prefix = text1.substring(0, x);
  const text1Suffix = text1.substring(x);
  const text2Prefix = text2.substring(0, y);
  const text2Suffix = text2.substring(y);
  const diffsPrefix = computeDiff(text1Prefix, text2Prefix);
  const diffsSuffix = computeDiff(text1Suffix, text2Suffix);
  return diffsPrefix.concat(diffsSuffix);
}

/**
 * @param {string} text1 
 * @param {string} text2 
 */
function getTextCommonPrefix(text1, text2) {
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  }

  const text = text1.length < text2.length ? text1 : text2;
  const lenght = ~binarySearch(text, (_, pointermid) => {
    if (text1.substring(0, pointermid) === text2.substring(0, pointermid)) {
      return 1;
    }
    return -1;
  });
  return lenght;
}

/**
 * @param {string} text1 
 * @param {string} text2 
 */
function getTextCommonSuffix(text1, text2) {
  if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  }

  const text = text1.length < text2.length ? text1 : text2;
  const pointerend = ~binarySearch(text, (_, pointermid) => {
    if (
      text1.substring(text1.length - pointermid, text1.length) ===
      text2.substring(text2.length - pointermid, text2.length)) {
      return -1;
    }
    return 1;
  });
  return text.length - pointerend;
}
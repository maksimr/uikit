import { useMemo } from 'react';

/**
 * @typedef {React.MutableRefObject | function | null} ReactRef
 */

/**
 * @typedef {function(*): void} MergeRefCallback
 */

/**
 * @param {...ReactRef} refs
 * @returns {MergeRefCallback}
 */
export function mergeRefs(...refs) {
  return value => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    });
  };
}

/**
 * @param {...ReactRef} refs
 * @returns {MergeRefCallback}
 */
export function useMergeRefs(...refs) {
  return useMemo(() => mergeRefs(...refs), refs);
}
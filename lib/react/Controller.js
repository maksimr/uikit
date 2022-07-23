import React, { createContext, useContext, useMemo } from 'react';

/**
 * @typedef ControllerLookup
 * @property {Set<any>} type
 * @property {any} value
 * @property {ControllerLookup|null} parent
 */
const ControllerContext = createContext(/**@type {ControllerLookup|null}*/(null));

/**
 * @typedef ControllerProviderProps
 * @property {any} value
 * @property {any} [type]
 * @property {React.ReactNode} [children]
 */
/**
 * @param {ControllerProviderProps} props
 * @returns {JSX.Element}
 */
export function ControllerProvider({ value, type = value.constructor, children }) {
  const parentControllerLookup = useContext(ControllerContext);
  const ctrlLookup = useMemo(() => {
    return {
      type: new Set([].concat(type)),
      value: value,
      parent: parentControllerLookup
    };
  }, [parentControllerLookup, value, type]);

  return (
    <ControllerContext.Provider value={ctrlLookup}>
      {children}
    </ControllerContext.Provider>
  );
}

/**
 * @template T
 * @typedef {{new(...args: any[]): T}} Controller
 */
/**
 * @template T
 * @param {Controller<T>} type
 * @returns {T}
 */
export function useController(type) {
  const ctrlLookup = useContext(ControllerContext);
  return useMemo(() => {
    if (!type) {
      return ctrlLookup ? ctrlLookup.value : null;
    }

    let lookup = ctrlLookup;
    while (lookup) {
      if (lookup.type.has(type) || (lookup.value instanceof type)) {
        return lookup.value;
      }
      lookup = lookup.parent;
    }
    return null;
  }, [ctrlLookup, type]);
}

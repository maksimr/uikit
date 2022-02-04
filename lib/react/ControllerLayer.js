import React, { createContext, useContext, useMemo } from 'react';

/**
 * @typedef ControllerLookup
 * @property {Set<any>} type
 * @property {any} value
 * @property {ControllerLookup|null} parent
 */
const ControllerLayerContext = createContext(/**@type {ControllerLookup|null}*/(null));

/**
 * @typedef ControllerLayerProps
 * @property {any} value
 * @property {any} [type]
 * @property {React.ReactNode} [children]
 */
/**
 * @param {ControllerLayerProps} props
 * @returns {JSX.Element}
 */
export function ControllerLayer({ value, type = value.constructor, children }) {
  const parentControllerLookup = useContext(ControllerLayerContext);
  const ctrlLookup = useMemo(() => {
    return {
      type: new Set([].concat(type)),
      value: value,
      parent: parentControllerLookup
    };
  }, [parentControllerLookup, value, type]);

  return (
    <ControllerLayerContext.Provider value={ctrlLookup}>
      {children}
    </ControllerLayerContext.Provider>
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
  const ctrlLookup = useContext(ControllerLayerContext);
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

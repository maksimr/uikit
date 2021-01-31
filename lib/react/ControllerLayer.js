import React, { createContext, useContext, useMemo } from 'react';

/**
 * @typedef ControllerLookup
 * @property {*} type
 * @property {*} value
 * @property {ControllerLookup|null} parent
 */
/**
 * @type {React.Context<(ControllerLookup|null)>}
 */
const ControllerLayerContext = (createContext(null));

/**
 * @typedef ControllerLayerProps
 * @property {any} value
 * @property {any} [type]
 * @property {(JSX.Element|string|null)} [children]
 */
/**
 * @param {ControllerLayerProps} props
 * @returns {JSX.Element}
 */
export function ControllerLayer({ value, type = value.constructor, children }) {
  const parentControllerLookup = useContext(ControllerLayerContext);
  const ctrlLookup = useMemo(() => {
    return {
      type: type,
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
      if (lookup.type === type) {
        return lookup.value;
      }
      lookup = lookup.parent;
    }
    return null;
  }, [ctrlLookup, type]);
}

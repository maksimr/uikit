import React, { createContext, useContext, useMemo } from 'react';

const ControllerLayerContext = createContext(null);

export function ControllerLayer({value, type = value.constructor, children}) {
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

// eslint-disable-next-line valid-jsdoc
/**
 * @template T
 * @param {{new(...args: any[]): T}} type
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

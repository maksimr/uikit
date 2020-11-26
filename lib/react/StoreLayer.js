import React, { createContext, useContext, useEffect, useState } from 'react';

const StoreLayerContext = createContext(null);

/**
 * @typedef { import("./../Store").Store } Store
 */

/**
 * @param {{store: Store, children: (Array<(JSX.Element|string)>|(JSX.Element|string))}} props
 * @returns {JSX.Element}
 */
export function StoreLayer({ store, children }) {
  return <StoreLayerContext.Provider value={store}>{children}</StoreLayerContext.Provider>;
}

/**
 * @param {function(any): any} [fn]
 * @returns {[any, function(function): any]}
 */
export function useStore(fn) {
  const store = useContext(StoreLayerContext);
  const [value, setValue] = useState(fn ? fn(store.value) : store.value);
  useEffect(() => {
    return store.addListener((state) => {
      setValue(fn ? fn(state) : state);
    });
  }, [store, fn]);
  return [value, store.swap];
}

import React, { createContext, useContext, useEffect, useState } from 'react';

const StoreLayerContext = createContext(/**@type {Store|null}*/(null));

/**
 * @typedef { import("./../Store").Store } Store
 */
/**
 * @template T
 * @typedef { import("./../Store").Producer<T> } Producer
 */

/**
 * @param {{store: Store, children: (Array<(JSX.Element|string)>|(JSX.Element|string))}} props
 * @returns {JSX.Element}
 */
export function StoreLayer({ store, children }) {
  return <StoreLayerContext.Provider value={store}>{children}</StoreLayerContext.Provider>;
}

/**
 * @template T
 * @param {function(T): any} [fn]
 * @returns {[T, function(Producer<T>): any]}
 */
export function useStore(fn) {
  const store = useContext(StoreLayerContext);
  if (store === null) {
    throw Error('Store is not provided');
  }
  const [value, setValue] = useState(fn ? fn(store.value) : store.value);
  useEffect(() => {
    return store.addListener((state) => setValue(fn ? fn(state) : state));
  }, [store, fn]);
  return [value, store.swap];
}

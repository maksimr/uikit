import React, { createContext, useContext, useEffect, useState } from 'react';

const StoreLayerContext = createContext(/**@type {Store<*>|null}*/(null));

/**
 * @template T
 * @typedef { import("./../Store").Store<T> } Store
 */

/**
 * @template T
 * @typedef { import("./../Store").Producer<T> } Producer
 */

/**
 * @template T
 * @typedef StoreLayerProps
 * @property {Store<T>} store
 * @property {React.ReactNode} [children]
 */

/**
 * @template T
 * @param {StoreLayerProps<T>} props
 * @returns {JSX.Element}
 */
export function StoreLayer({ store, children }) {
  return <StoreLayerContext.Provider value={store}>{children}</StoreLayerContext.Provider>;
}

/**
 * @template S
 * @template V
 * @param {function(S): V} [fn]
 * @returns {[V, function(Producer<S>): any]}
 */
export function useStore(fn) {
  const store = useContext(StoreLayerContext);
  if (store === null) {
    throw Error('Store is not provided');
  }
  const [value, setValue] = useState(fn ? fn(store.value) : store.value);
  useEffect(() => {
    return store.watch((state) => setValue(fn ? fn(state) : state));
  }, [store, fn]);
  return [value, store.swap];
}

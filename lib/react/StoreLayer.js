import React, { createContext, useContext, useEffect, useState } from 'react';

const StoreLayerContext = createContext(/**@type {Store<*>|null}*/(null));

/**
 * @template T
 * @typedef { import("../store").Store<T> } Store
 */

/**
 * @template T
 * @typedef { import("../store").Producer<T> } Producer
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
 * @template QueryFunction
 * @template QueryValue
 * @param {function(QueryFunction): QueryValue} [fn]
 * @returns {[QueryValue, function(Producer<QueryFunction>): any]}
 */
export function useStore(fn) {
  const store = useContext(StoreLayerContext);
  if (store === null) {
    throw Error('Store is not provided');
  }
  const [state, setState] = useState(fn ? fn(store.value) : store.value);
  useEffect(() => {
    setState(fn ? fn(store.value) : store.value);
    return store.watch((state) => setState(fn ? fn(state) : state));
  }, [store, fn]);
  return [state, store.swap];
}

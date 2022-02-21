import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { cursor } from '../store';

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
 * @template State
 * @template QueryState
 * @typedef CursorProps
 * @property {import('../store').StoreQueryFunction<State,QueryState>} query
 * @property {React.ReactNode} [children]
 */
/**
 * @template State
 * @template QueryState
 * @param {CursorProps<State, QueryState>} props
 * @returns {JSX.Element}
 */
export function Cursor({ query, children }) {
  const rootStore = useContext(StoreLayerContext);
  if (rootStore === null) {
    throw Error('Store is not provided');
  }
  const { store, destroy } = useMemo(() => {
    return cursor(rootStore, query);
  }, [query, rootStore]);
  useLayoutEffect(() => destroy, [destroy]);
  return (
    <StoreLayerContext.Provider value={store}>
      {children}
    </StoreLayerContext.Provider>
  );
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

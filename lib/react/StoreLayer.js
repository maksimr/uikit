import React, { createContext, useContext, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react';
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
  const ref = useRef(query);
  if (rootStore === null) {
    throw Error('Store is not provided');
  }
  ref.current = query;
  const { store, destroy } = useMemo(() => {
    return cursor(rootStore, (...args) => ref.current(...args));
  }, [rootStore]);
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
  const state = useSyncExternalStore(
    store.watch,
    () => (fn ? fn(store.value) : store.value)
  );
  return [state, store.swap];
}

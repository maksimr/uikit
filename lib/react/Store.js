import React, { createContext, useContext, useLayoutEffect, useMemo, useSyncExternalStore } from 'react';
import { createCursor } from '../store';

const StoreContext = createContext(/**@type {Store<*>|null}*/(null));

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
 * @typedef StoreProviderProps
 * @property {Store<T>} store
 * @property {React.ReactNode} [children]
 */

/**
 * @template T
 * @param {StoreProviderProps<T>} props
 * @returns {JSX.Element}
 */
export function StoreProvider({ store, children }) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
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
  const rootStore = useContext(StoreContext);
  if (rootStore === null) {
    throw Error('Store is not provided');
  }
  const { store, destroy } = useMemo(() => {
    return createCursor(rootStore, (...args) => query(...args));
  }, [rootStore, query]);
  useLayoutEffect(() => destroy, [destroy]);
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

/**
 * @template QueryFunction
 * @template QueryValue
 * @param {function(QueryFunction): QueryValue} [fn]
 * @returns {[QueryValue, function(Producer<QueryFunction>): any]}
 */
export function useStore(fn) {
  const store = useContext(StoreContext);
  if (store === null) {
    throw Error('Store is not provided');
  }
  const state = useSyncExternalStore(
    store.watch,
    () => (fn ? fn(store.value) : store.value)
  );
  return [state, store.swap];
}

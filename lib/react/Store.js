import React, { createContext, useContext, useInsertionEffect, useMemo } from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { createStoreCursor } from '../store';

const StoreContext = createContext(/**@type {Store<*>|null}*/(null));

/**
 * @template T
 * @typedef {(a: T, b: T) => boolean} EqualityFn
 */

/**
 * @type {EqualityFn<any>}
 */
const refEquality = (a, b) => a === b;

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
export function StoreCursor({ query, children }) {
  const rootStore = useContext(StoreContext);
  if (rootStore === null) {
    throw Error('Store is not provided');
  }
  const { store, destroy } = useMemo(() => {
    return createStoreCursor(rootStore, (...args) => query(...args));
  }, [rootStore, query]);
  useInsertionEffect(() => destroy, [destroy]);
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
 * @param {EqualityFn<QueryValue>} [equalityFn]
 * @returns {[QueryValue, function(Producer<QueryFunction>): any]}
 */
export function useStore(fn, equalityFn = refEquality) {
  const store = useContext(StoreContext);
  if (store === null) {
    throw Error('Store is not provided');
  }
  const state = useSyncExternalStoreWithSelector(
    store.watch,
    () => store.value,
    () => store.value,
    () => (fn ? fn(store.value) : store.value),
    equalityFn
  );
  return [state, store.swap];
}

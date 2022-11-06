/**
 * @template T
 * @typedef {function(T,...any=):(T|void)} Producer
 */

/**
 * @template T
 * @typedef {function(T,Producer<T>):T} Reducer
 */

/**
 * @template T
 * @typedef {function(T, T):*} StoreWatcher
 */

/**
 * @template T
 * @typedef {{watcher: StoreWatcher<T>|null}} StoreListener
 */

/**
 * @template State
 * @template QueryState
 * @typedef {(state: State) => (QueryState|void)} StoreQueryFunction
 */

/**
 * @template T
 */
export class Store {
  /**
   * @param {T} initValue
   * @param {Reducer<T>} reducer
   */
  constructor(initValue, reducer) {
    this.value = initValue;
    this.reducer = reducer;
    this.swap = this.swap.bind(this);
    this.watch = this.watch.bind(this);

    /**
     * @private
     * @type {StoreListener<T>[]}
     */
    this.listeners = [];
    /**
     * @private
     * @type {typeof this.listeners | null}
     */
    this.processingListeners = null;
  }

  /**
   * @description Swaps the value of store
   * @param {Producer<T>} fn
   * @param  {...any} args Additional arguments which would be passed to producer function
   * @returns {T}
   */
  swap(fn, ...args) {
    const prevValue = this.value;
    this.value = this.reducer(prevValue, (state) => fn(state, ...args));

    if (this.value !== prevValue) {
      const prevProcessingListeners = this.processingListeners;
      this.processingListeners = this.listeners;
      this.processingListeners.forEach((listener) => listener?.watcher?.(this.value, prevValue));
      this.processingListeners = prevProcessingListeners;
    }

    return this.value;
  }

  /**
   * @description The method sets up a function that will be called whenever the state is changed
   * @param {StoreWatcher<T>|null} watcher
   * @param {Boolean} [invokeImmediately] Should be watcher function called immediately after attach. By default false
   * @returns {function():void} Remove watcher function
   */
  watch(watcher, invokeImmediately = false) {
    const listener = /**@type {StoreListener<T>}*/({ watcher });
    this.listeners.push(listener);
    if (invokeImmediately) {
      listener?.watcher?.(this.value, this.value);
    }
    return this.deregister.bind(this, listener);
  }

  /**
   * @private
   * @param {StoreListener<T>} listener 
   */
  deregister(listener) {
    listener.watcher = null;
    const listeners = this.getListenersForMutation();
    listeners.splice(listeners.indexOf(listener), 1);
  }

  /**
   * @private
   * @returns {StoreListener<T>[]}
   */
  getListenersForMutation() {
    if (this.processingListeners === this.listeners) {
      this.listeners = Array.from(this.listeners);
    }
    return this.listeners;
  }
}

/**
 * @template T
 * @param {T} initValue
 * @param {Reducer<T>} reducer
 * @returns {Store<T>}
 */
export function createStore(initValue, reducer) {
  return new Store(initValue, reducer);
}

/**
 * @description Create a cursor which point on part of the passed store
 * @template State
 * @template QueryState
 * @param {Store<State>} rootStore
 * @param {StoreQueryFunction<State, QueryState>} query
 * @returns {{store: Store<ReturnType<query>>, destroy: () => void}}
 */
export function createStoreCursor(rootStore, query) {
  const ref = { isLocked: false };
  const cursorStore = createStore(query(rootStore.value), (_, fn) => {
    ref.isLocked = true;
    rootStore.swap((rootState, ...args) => {
      fn(query(rootState), ...args);
    });
    ref.isLocked = false;
    return query(rootStore.value);
  });

  const destroy = rootStore.watch((rootState) => {
    if (!ref.isLocked && query(rootState) !== cursorStore.value) {
      cursorStore.swap((state) => state);
    }
  });

  return { store: cursorStore, destroy };
}
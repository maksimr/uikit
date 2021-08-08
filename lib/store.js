/**
 * @template T
 * @typedef {function(T,...any=):(T|void)} Producer
 */

/**
 * @template T
 * @typedef {function(T,(state: T) => ReturnType<Producer<T>>):T} Reducer
 */

/**
 * @template T
 * @typedef {function(T, T):*} StoreListener
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
    /**@type {StoreListener<T>[]}*/
    this.listeners = [];
    this.swap = this.swap.bind(this);
    this.watch = this.watch.bind(this);
  }

  /**
   * @param {Producer<T>} fn
   * @param  {...any} args
   * @returns {T}
   */
  swap(fn, ...args) {
    const prevValue = this.value;
    this.value = this.reducer(prevValue, (state) => fn(state, ...args));

    if (this.value !== prevValue) {
      this.listeners.forEach((it) => it(this.value, prevValue));
    }

    return this.value;
  }

  /**
   * @param {StoreListener<T>} listener
   * @returns {function():void}
   */
  watch(listener) {
    this.listeners.push(listener);
    listener(this.value, this.value);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}
/**
 * @template T
 * @typedef {function(T,...any=):*} Producer
 */

/**
 * @template T
 */
export class Store {
  /**
   * @param {T} initValue
   * @param {function(T,Producer<T>):T} reducer
   */
  constructor(initValue, reducer) {
    this.value = initValue;
    this.reducer = reducer;
    this.listeners = [];
    this.swap = this.swap.bind(this);
    this.addListener = this.addListener.bind(this);
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
   * @param {function(T, T):*} listener
   * @returns {function():void}
   */
  addListener(listener) {
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
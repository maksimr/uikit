/**
 * @param {...string|Object|Array<*>} args
 * @returns {string}
 */
export function concatNames(...args) {
  return args.reduce(reduceNames, '');
}

function reduceNames(/**@type {string}*/str, /**@type {any}*/arg) {
  const value = Array.isArray(arg) ?
    classNames(...arg) :
    (typeof arg === 'object' && arg !== null ?
      Object.keys(arg).filter((it) => arg[it]).join(' ') :
      arg);
  return !value ? str : (str ? str + ' ' : str) + value;
}

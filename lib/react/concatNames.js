/**
 * @param {...string|Object|Array<*>} args
 * @returns {string}
 */
export function concatNames(...args) {
  return args.reduce(reduceNames, '');
}

function reduceNames(/**@type {string}*/str, /**@type {any}*/arg) {
  const value = Array.isArray(arg) ?
    concatNames(...arg) :
    (typeof arg === 'object' ?
      Object.keys(arg).filter((it) => arg[it]).join(' ') :
      arg);
  return (str ? str + ' ' : str) + value;
}
/**
 * @param {...string|Object|Array} args
 * @returns {string}
 */
export function concatNames(...args) {
  return args.reduce(reduceNames, '');
}

function reduceNames(str, arg) {
  const value = Array.isArray(arg) ?
    concatNames(...arg) :
    (typeof arg === 'object' ?
      Object.keys(arg).filter((it) => arg[it]).join(' ') :
      arg);
  return (str ? str + ' ' : str) + value;
}
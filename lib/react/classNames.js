/**
 * @param {...string|Object|Array} args
 * @returns {string}
 */
export function classNames(...args) {
  return args.reduce((str, arg) => {
    const value = Array.isArray(arg) ?
      classNames(...arg) :
      (typeof arg === 'object' ?
        Object.keys(arg).filter((it) => arg[it]).join(' ') :
        arg);
    return (str ? str + ' ' : str) + value;
  }, '');
}
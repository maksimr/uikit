/**
 * @typedef BigDecimal
 * @property {number} sign
 * @property {string} mantissa
 * @property {number} exponent
 */

/**
 * @param {BigDecimal | null} decimalX
 * @param {BigDecimal | null} decimalY
 * @returns {BigDecimal | null}
 */
export function add(decimalX, decimalY) {
  if (!decimalX || !decimalY) return null;
  const bigIntY = BigInt(decimalY.sign) * BigInt(decimalY.mantissa) * BigInt(10 ** Math.max(decimalY.exponent - decimalX.exponent, 0));
  const bigIntX = BigInt(decimalX.sign) * BigInt(decimalX.mantissa) * BigInt(10 ** Math.max(decimalX.exponent - decimalY.exponent, 0));
  return bigIntToBigDecimal(
    bigIntY + bigIntX,
    Math.min(decimalX.exponent, decimalY.exponent)
  );
}

export function subtract(
  /**@type {BigDecimal|null}*/decimalX,
  /**@type {BigDecimal|null}*/decimalY
) {
  return add(decimalX, changeSign(decimalY));
}

export function multiply(
  /**@type {BigDecimal|null}*/decimalX,
  /**@type {BigDecimal|null}*/decimalY
) {
  if (!decimalX || !decimalY) return null;
  const bigIntY = BigInt(decimalY.sign) * BigInt(decimalY.mantissa);
  const bigIntX = BigInt(decimalX.sign) * BigInt(decimalX.mantissa);
  return bigIntToBigDecimal(
    bigIntY * bigIntX,
    decimalX.exponent + decimalY.exponent
  );
}

export function decimal(/**@type {string|number}*/str) {
  return parse(String(str));
}

export function stringify(/**@type {BigDecimal | null}*/decimal) {
  if (!decimal) return '';

  const dx = decimal.mantissa.length + decimal.exponent;
  const idx = Math.max(dx, 0);
  const integerPart = decimal.mantissa.slice(0, idx) || '0';
  const fractionZeroPart = '0'.repeat(Math.max(-dx, 0));
  const fractionDigitPart = decimal.mantissa.slice(idx).replace(/0+$/, '') || '';
  const fractionPart = fractionZeroPart + fractionDigitPart;
  return `${decimal.sign === -1 ? '-' : ''}${integerPart}${fractionPart ? '.' + fractionPart : ''}`;
}

/**
 * 
 * @param {string} str
 * @returns {BigDecimal | null}
 */
function parse(/**@type {string}*/str) {
  const digitRegExp = /^-?(\d+(\.\d*)?)$/i;

  if (!digitRegExp.test(str)) {
    return null;
  }

  const sign = str[0] === '-' ? -1 : 1;
  const unsignedStr = (str[0] === '-' || str[0] === '+') ? str.slice(1) : str;
  const [integerPartWithLeadingZeros, fractionPartWithTrailingZeros] = unsignedStr.split('.');
  const integerPart = integerPartWithLeadingZeros.replace(/^0+/, '');
  const fractionPart = (fractionPartWithTrailingZeros || '').replace(/0+$/, '');
  const exponent = fractionPart ? -fractionPart.length : 0;
  const mantissa = integerPart + (fractionPart || '');
  return { sign, mantissa, exponent };
}

/**
 * @param {BigDecimal | null} decimal
 * @returns {BigDecimal | null}
 */
function changeSign(decimal) {
  return decimal ? {
    sign: -decimal.sign,
    mantissa: decimal.mantissa,
    exponent: decimal.exponent
  } : null;
}

/**
 * @param {bigint} bigInt
 * @param {number} exponent
 * @returns {BigDecimal}
 */
function bigIntToBigDecimal(bigInt, exponent) {
  return {
    sign: bigInt < 0 ? -1 : 1,
    mantissa: bigInt.toString().replace(/^-/, ''),
    exponent: exponent
  };
}
/**
 * @typedef BigDecimalObject
 * @property {number} sign
 * @property {string} mantissa
 * @property {number} exponent
 */

/**
 * @typedef {string|number|BigDecimal} BigDecimalValue 
 */

export class BigDecimal {
  static from(/**@type {BigDecimalValue}*/value) {
    if (value === null) throw Error('Decimal value can not be null');
    if (value instanceof BigDecimal) return value;
    const decimal = parse(String(value));
    if (decimal === null) throw Error('Invalid decimal value');
    return new BigDecimal(decimal);
  }

  constructor(/**@type {BigDecimalObject}*/decimal) {
    /**@type {number}*/
    this.sign = decimal.sign;
    /**@type {string}*/
    this.mantissa = decimal.mantissa;
    /**@type {number}*/
    this.exponent = decimal.exponent;
    Object.seal(this);
  }

  add(/**@type {BigDecimalValue}*/decimal) {
    return new BigDecimal(add(this, BigDecimal.from(decimal)));
  }

  subtract(/**@type {BigDecimalValue}*/decimal) {
    return new BigDecimal(subtract(this, BigDecimal.from(decimal)));
  }

  multiply(/**@type {BigDecimalValue}*/decimal) {
    return new BigDecimal(multiply(this, BigDecimal.from(decimal)));
  }

  toString() {
    return stringify(this);
  }
}

/**
 * @param {BigDecimalObject} decimalX
 * @param {BigDecimalObject} decimalY
 * @returns {BigDecimalObject}
 */
function add(decimalX, decimalY) {
  const bigIntY = BigInt(decimalY.sign) * BigInt(decimalY.mantissa) * BigInt(10 ** Math.max(decimalY.exponent - decimalX.exponent, 0));
  const bigIntX = BigInt(decimalX.sign) * BigInt(decimalX.mantissa) * BigInt(10 ** Math.max(decimalX.exponent - decimalY.exponent, 0));
  return bigIntToBigDecimal(
    bigIntY + bigIntX,
    Math.min(decimalX.exponent, decimalY.exponent)
  );
}

function subtract( /**@type {BigDecimalObject}*/decimalX, /**@type {BigDecimalObject}*/decimalY) {
  return add(decimalX, changeSign(decimalY));
}

function multiply( /**@type {BigDecimalObject}*/decimalX, /**@type {BigDecimalObject}*/decimalY) {
  const bigIntY = BigInt(decimalY.sign) * BigInt(decimalY.mantissa);
  const bigIntX = BigInt(decimalX.sign) * BigInt(decimalX.mantissa);
  return bigIntToBigDecimal(
    bigIntY * bigIntX,
    decimalX.exponent + decimalY.exponent
  );
}

function stringify(/**@type {BigDecimalObject | null}*/decimal) {
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
 * @returns {BigDecimalObject | null}
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
 * @param {BigDecimalObject} decimal
 * @returns {BigDecimalObject}
 */
function changeSign(decimal) {
  return {
    sign: -decimal.sign,
    mantissa: decimal.mantissa,
    exponent: decimal.exponent
  };
}

/**
 * @param {bigint} bigInt
 * @param {number} exponent
 * @returns {BigDecimalObject}
 */
function bigIntToBigDecimal(bigInt, exponent) {
  return {
    sign: bigInt < 0 ? -1 : 1,
    mantissa: bigInt.toString().replace(/^-/, ''),
    exponent: exponent
  };
}
/**
 * @enum {number}
 */
export const DAY_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
};

/**
 * @typedef {({MONTH: [ string, string, string, string, string, string, string, string, string, string, string, string ], SHORTMONTH: string[], WEEKENDRANGE: number[], FIRSTDAYOFWEEK: number, ERANAMES: [string, string], AMPMS: [string, string], STANDALONEMONTH: string[], SHORTDAY: string[], DAY: string[], ERAS: [string, string], defaultFormat: string} & Object<string,*>)} DateTimeLocale
 */
/**
 * @type {DateTimeLocale}
 */
export const dateTimeLocale = {
  ERANAMES: ['Before Christ', 'Anno Domini'],
  ERAS: ['BC', 'AD'],
  AMPMS: ['AM', 'PM'],
  DAY: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],
  SHORTDAY: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  MONTH: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  SHORTMONTH: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  STANDALONEMONTH: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  FIRSTDAYOFWEEK: DAY_OF_WEEK.SUNDAY,
  WEEKENDRANGE: [DAY_OF_WEEK.SATURDAY, DAY_OF_WEEK.SUNDAY],
  defaultFormat: 'MMM d, y'
};

//                    1        2       3         4          5          6          7          8  9     10      11
const R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;

const DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/;

/**
 * @type {Object<string,function>}
 */
const DATE_FORMATS = {
  yyyy: dateGetter('FullYear', 4, 0, false, true),
  yy: dateGetter('FullYear', 2, 0, true, true),
  y: dateGetter('FullYear', 1, 0, false, true),
  MMMM: dateStrGetter('Month'),
  MMM: dateStrGetter('Month', true),
  MM: dateGetter('Month', 2, 1),
  M: dateGetter('Month', 1, 1),
  LLLL: dateStrGetter('Month', false, true),
  dd: dateGetter('Date', 2),
  d: dateGetter('Date', 1),
  HH: dateGetter('Hours', 2),
  H: dateGetter('Hours', 1),
  hh: dateGetter('Hours', 2, -12),
  h: dateGetter('Hours', 1, -12),
  mm: dateGetter('Minutes', 2),
  m: dateGetter('Minutes', 1),
  ss: dateGetter('Seconds', 2),
  s: dateGetter('Seconds', 1),
  // while ISO 8601 requires fractions to be prefixed with `.` or `,`
  // we can be just safely relied on using `sss` since we currently don't support single or two digit fractions
  sss: dateGetter('Milliseconds', 3),
  EEEE: dateStrGetter('Day'),
  EEE: dateStrGetter('Day', true),
  a: ampmGetter,
  Z: timeZoneGetter,
  ww: weekGetter(2),
  w: weekGetter(1),
  G: eraGetter,
  GG: eraGetter,
  GGG: eraGetter,
  GGGG: longEraGetter
};

/**
 * @typedef DateParseOptions
 * @property {Date} [previousDate]
 * @property {string} [timezone] Parse date string in the specific timezone to the date in local timezone
 * @property {DateTimeLocale} [dateTimeLocale]
 * @property {boolean} [ignoreCase]
 */
/**
 * @description Parse string to the Date object if it matches a passed date format otherwise returns null
 * @param {string} dateStr
 * @param {string} format Date format
 * @param {DateParseOptions} [options]
 * @returns {Date|null}
 */
export function parse(dateStr, format, options) {
  dateStr = dateStr.trim();

  const locale = options?.dateTimeLocale || dateTimeLocale;
  const previousDate = options?.previousDate || new Date(0);

  /**
   * @type {Object<string,string[]>}
   */
  const DATE_FORMAT_TO_STRING = {
    EEEE: locale.DAY,
    EEE: locale.SHORTDAY,
    MMMM: locale.MONTH,
    MMM: locale.SHORTMONTH
  };

  const word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
  /**
   * @type {Object<string,[RegExp, string]>}
   */
  const mappings = {
    yyyy: [/\d{4,}/, 'yyyy'],
    yy: [/\d{2,}/, 'yyyy'],
    y: [/\d{1,}/, 'yyyy'],
    MMMM: [word, 'MM'],
    MMM: [word, 'MM'],
    MM: [/\d{1,2}/, 'MM'],
    M: [/\d{1,2}/, 'MM'],
    EEEE: [word, 'dd'],
    EEE: [word, 'dd'],
    dd: [/\d{1,2}/, 'dd'],
    d: [/\d{1,2}/, 'dd'],
    HH: [/\d{1,2}/, 'HH'],
    H: [/\d{1,2}/, 'HH'],
    hh: [/\d{1,2}/, 'HH'],
    h: [/\d{1,2}/, 'HH'],
    mm: [/\d{1,2}/, 'mm'],
    m: [/\d{1,2}/, 'mm'],
    ss: [/\d{1,2}/, 'ss'],
    sss: [/\d{1,3}/, 'sss']
  };

  /**
   * @type {Object<string,number>}
   */
  const dateParts = {
    yyyy: previousDate.getFullYear(),
    MM: previousDate.getMonth() + 1,
    dd: previousDate.getDate(),
    HH: previousDate.getHours(),
    mm: previousDate.getMinutes(),
    ss: previousDate.getSeconds(),
    sss: previousDate.getMilliseconds() / 1000
  };

  /**
   * @type {string|null}
   */
  let parsedFormat = format;
  while (parsedFormat && dateStr) {
    const match = DATE_FORMATS_SPLIT.exec(parsedFormat);
    const part = match ? match[1] : parsedFormat;
    parsedFormat = match ? match[2] : null;

    const [regexp, partName] = mappings[part] || [new RegExp('\\s*' + part + '\\s*'), ''];
    const pmatch = regexp.exec(dateStr);
    if (!pmatch) {
      return null;
    }

    if (partName) {
      const value = pmatch[0];
      if (part === 'y' || part === 'yy') {
        const da = new Date();
        const cent = +('' + da.getFullYear()).substring(0, 2);
        const v = parseInt(value);
        dateParts[partName] = parseInt('' + (v > 68 ? cent - 1 : cent) + v);
      } else if (DATE_FORMAT_TO_STRING[part]) {
        const dateIndex = DATE_FORMAT_TO_STRING[part].findIndex((str) => {
          return options?.ignoreCase ?
            (str.toLowerCase() === value.toLowerCase()) :
            (str === value);
        });
        // eslint-disable-next-line max-depth
        if (dateIndex < 0) {
          return null;
        }
        dateParts[partName] = dateIndex + 1;
      } else {
        dateParts[partName] = parseInt(value);
      }
    }

    dateStr = dateStr.substring(pmatch[0].length);
  }

  if (dateStr.length || parsedFormat?.length) {
    return null;
  }

  const date = new Date(
    dateParts.yyyy,
    dateParts.MM - 1,
    dateParts.dd,
    dateParts.HH,
    dateParts.mm,
    dateParts.ss || 0,
    dateParts.sss * 1000 || 0
  );
  if (dateParts.yyyy < 100) {
    // In the constructor, 2-digit years map to 1900-1999.
    // Use `setFullYear()` to set the correct year.
    date.setFullYear(dateParts.yyyy);
  }

  return (
    options?.timezone ?
      convertTimezoneToLocal(date, options.timezone) :
      date
  );
}

/**
 * @description Formats date to a string based on the requested format
 * @param {Date|string|number} date Date to format either as Date object, milliseconds (string or number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.sssZ and its shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is specified in the string input, the time is considered to be in the local timezone
 * @param {string|((date: Date) => string)} [format]
 * @param {string|number} [timezone] Timezone to be used for formatting. It understands UTC/GMT and the continental US time zone abbreviations, but for general use, use a time zone offset, for example, '+0430' (4 hours, 30 minutes east of the Greenwich meridian) or number in minutes. If not specified, the timezone of the browser will be used
 * @param {DateTimeLocale} [locale]
 * @returns {string}
 */
export function strftime(date, format, timezone, locale = dateTimeLocale) {
  format = format || locale.defaultFormat;

  if (typeof date === 'string') {
    const NUMBER_STRING = /^-?\d+$/;
    date = NUMBER_STRING.test(date) ? toInt(date) : jsonStringToDate(date);
  }

  if (typeof date === 'number') {
    date = new Date(date);
  }

  if (!isDate(date) || !isFinite(date.getTime())) {
    return String(date);
  }

  let dateTimezoneOffset = date.getTimezoneOffset();
  if (timezone != null && timezone !== '') {
    dateTimezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
    date = convertTimezoneToLocal(date, timezone, true);
  }

  if (typeof format === 'function') {
    return format(date);
  }

  /**
   * @type {string|null|undefined}
   */
  let parsedFormatStr = format;
  /**@type {string[]}*/
  let parts = [];
  let match;
  while (parsedFormatStr) {
    match = DATE_FORMATS_SPLIT.exec(parsedFormatStr);
    if (match) {
      parts = parts.concat(match.slice(1));
      parsedFormatStr = parts.pop();
    } else {
      parts.push(parsedFormatStr);
      parsedFormatStr = null;
    }
  }

  let text = '';
  let fn;
  parts.forEach(function(value) {
    fn = DATE_FORMATS[value];
    text += fn
      ? fn(date, locale, dateTimezoneOffset)
      : value === '\'\''
        ? '\''
        : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
  });

  return text;
}

/**
 * @param {string} string
 * @returns {Date}
 */
function jsonStringToDate(string) {
  let match;
  if ((match = string.match(R_ISO8601_STR))) {
    const date = new Date(0);
    let tzHour = 0;
    let tzMin = 0;
    const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
    const timeSetter = match[8] ? date.setUTCHours : date.setHours;

    if (match[9]) {
      tzHour = toInt(match[9] + match[10]);
      tzMin = toInt(match[9] + match[11]);
    }
    dateSetter.call(
      date,
      toInt(match[1]),
      toInt(match[2]) - 1,
      toInt(match[3])
    );
    const h = toInt(match[4] || '') - tzHour;
    const m = toInt(match[5] || '') - tzMin;
    const s = toInt(match[6] || '');
    const ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
    timeSetter.call(date, h, m, s, ms);
    return date;
  }
  return new Date(string);
}

/**
 * @param {string|number} timezone
 * @param {number} fallback
 * @returns {number}
 */
function timezoneToOffset(timezone, fallback) {
  if (typeof timezone === 'number') {
    return timezone;
  }
  const ALL_COLONS = /:/g;
  timezone = timezone.replace(ALL_COLONS, '');
  const requestedTimezoneOffset =
    Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
  return Number.isNaN(requestedTimezoneOffset)
    ? fallback
    : requestedTimezoneOffset;
}

/**
 * @description Convert date object to date object in passed timezone or if `reverse` set to `true`
 * convert date object in passed timezone to date object in local. This function very helpful when you need
 * to pass date object in UI component which doesn't work with timezones and convert date object from such
 * component back to date object in correct timezone. Most common example calendar component
 * @param {Date} date
 * @param {string|number} [timezone]
 * @param {boolean} [reverse]
 * @returns {Date}
 */
export function convertTimezoneToLocal(date, timezone, reverse = false) {
  if (!(timezone != null && timezone !== '')) {
    return date;
  }
  const dr = reverse ? -1 : 1;
  const dateTimezoneOffset = date.getTimezoneOffset();
  const timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
  return addDateMinutes(date, dr * (timezoneOffset - dateTimezoneOffset));
}

/**
 * @param {Date} date
 * @param {number} minutes
 * @returns {Date}
 */
function addDateMinutes(date, minutes) {
  date = new Date(date.getTime());
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

/**
 * @private
 * @template T
 * @typedef {T extends `get${infer R}` ? R : never} GetterName
 */
/**
 * @private
 * @typedef {Exclude<GetterName<keyof Date>, 'VarDate'>} DateGetterName
 */

function dateGetter(/**@type {DateGetterName}*/name, /**@type {number}*/size, /**@type {number}*/offset = 0, /**@type {boolean}*/trim = false, /**@type {boolean}*/negWrap = false) {
  return function(/**@type {Date}*/date) {
    let value = date[`get${name}`]();
    if (offset > 0 || value > -offset) {
      value += offset;
    }
    if (value === 0 && offset === -12) {
      value = 12;
    }
    return padNumber(value, size, trim, negWrap);
  };
}

function dateStrGetter(/**@type {DateGetterName}*/name, /**@type {boolean}*/shortForm = false, /**@type {boolean}*/standAlone = false) {
  return function(/**@type {Date}*/date, /**@type {DateTimeLocale}*/formats) {
    const value = date[`get${name}`]();
    const propPrefix =
      (standAlone ? 'STANDALONE' : '') + (shortForm ? 'SHORT' : '');
    const get = (propPrefix + name).toUpperCase();

    return formats[get][value];
  };
}

function ampmGetter(/**@type {Date}*/date, /**@type {DateTimeLocale}*/formats) {
  return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
}

function eraGetter(/**@type {Date}*/date, /**@type {DateTimeLocale}*/formats) {
  return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
}

function longEraGetter(/**@type {Date}*/date, /**@type {DateTimeLocale}*/formats) {
  return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
}

function timeZoneGetter(/**@type {Date}*/date, /**@type {DateTimeLocale}*/formats, /**@type {number}*/offset) {
  const zone = -1 * offset;
  let paddedZone = zone >= 0 ? '+' : '';

  paddedZone +=
    padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +
    padNumber(Math.abs(zone % 60), 2);

  return paddedZone;
}

function weekGetter(/**@type {number}*/size) {
  return function(/**@type {Date}*/date) {
    const firstThurs = getFirstThursdayOfYear(date.getFullYear());
    const thisThurs = getThursdayThisWeek(date);

    const diff = +thisThurs - +firstThurs;
    const result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week

    return padNumber(result, size);
  };
}

function getFirstThursdayOfYear(/**@type {number}*/year) {
  // 0 = index of January
  const dayOfWeekOnFirst = new Date(year, 0, 1).getDay();
  // 4 = index of Thursday (+1 to account for 1st = 5)
  // 11 = index of *next* Thursday (+1 account for 1st = 12)
  return new Date(
    year,
    0,
    (dayOfWeekOnFirst <= 4 ? 5 : 12) - dayOfWeekOnFirst
  );
}

function getThursdayThisWeek(/**@type {Date}*/datetime) {
  return new Date(
    datetime.getFullYear(),
    datetime.getMonth(),
    // 4 = index of Thursday
    datetime.getDate() + (4 - datetime.getDay())
  );
}

/**
 * @param {number} num
 * @param {number} digits
 * @param {boolean} [trim]
 * @param {boolean} [negWrap]
 * @returns {string}
 */
function padNumber(num, digits, trim, negWrap) {
  const ZERO_CHAR = '0';
  let neg = '';
  if (num < 0 || (negWrap && num <= 0)) {
    if (negWrap) {
      num = -num + 1;
    } else {
      num = -num;
      neg = '-';
    }
  }

  let numStr = '' + num;
  while (numStr.length < digits) {
    numStr = ZERO_CHAR + numStr;
  }
  if (trim) {
    numStr = numStr.substring(numStr.length - digits);
  }
  return neg + numStr;
}

/**
 * @template T
 * @param {T} value
 * @returns {value is Date}
 */
function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]';
}

/**
 * @param {string|null} str
 * @returns {number}
 */
function toInt(str) {
  return str ? parseInt(str, 10) : 0;
}
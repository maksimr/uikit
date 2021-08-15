/**
 * @type {{
 *   year: 'year',
 *   quarter: 'quarter',
 *   month: 'month',
 *   week: 'week',
 *   day: 'day',
 *   hour: 'hour',
 *   minute: 'minute',
 *   second: 'second'
 * }}
 */
const DateUnit = {
  year: 'year',
  quarter: 'quarter',
  month: 'month',
  week: 'week',
  day: 'day',
  hour: 'hour',
  minute: 'minute',
  second: 'second'
};

/**
 * @param {number} ms Number of milliseconds between two dates
 * @returns {string}
 */
export function timeAgoFromMs(ms) {
  const sec = Math.round(ms / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  const month = Math.round(day / 30);
  const year = Math.round(month / 12);

  if (Math.abs(month) >= 12) {
    return formatRelativeTime(year, DateUnit.year);
  } else if (Math.abs(day) >= 30) {
    return formatRelativeTime(month, DateUnit.month);
  } else if (Math.abs(hr) >= 24) {
    return formatRelativeTime(day, DateUnit.day);
  } else if (Math.abs(min) >= 45) {
    return formatRelativeTime(hr, DateUnit.hour);
  } else if (Math.abs(sec) >= 45) {
    return formatRelativeTime(min, DateUnit.minute);
  } else if (Math.abs(sec) >= 10) {
    return formatRelativeTime(sec, DateUnit.second);
  } else {
    return formatRelativeTime(0, DateUnit.second);
  }
}

/**
 * @param {number} value Number of milliseconds between two dates
 * @param {DateUnit[keyof DateUnit]} unit Date format unit `year`, `quarter`, `month` etc.
 * @returns {string}
 */
function formatRelativeTime(value, unit) {
  if (value === 0) {
    switch (true) {
      case (unit === DateUnit.year):
      case (unit === DateUnit.quarter):
      case (unit === DateUnit.month):
      case (unit === DateUnit.week):
        return `this ${unit}`;
      case (unit === DateUnit.day):
        return 'today';
      case (unit === DateUnit.hour):
      case (unit === DateUnit.minute):
        return `in 0 ${unit}s`;
      case (unit === DateUnit.second):
        return 'now';
    }
  } else if (Math.abs(value) === 1) {
    switch (true) {
      case (unit === DateUnit.year):
      case (unit === DateUnit.quarter):
      case (unit === DateUnit.month):
      case (unit === DateUnit.week):
        return value > 0 ?
          `next ${unit}` :
          `last ${unit}`;
      case (unit === DateUnit.day):
        return value > 0 ?
          'tomorrow' :
          'yesterday';
      case (unit === DateUnit.hour):
      case (unit === DateUnit.minute):
      case (unit === DateUnit.second):
        return value > 0 ?
          `in 1 ${unit}` :
          `1 ${unit} ago`;
    }
  } else {
    switch (true) {
      case (unit === DateUnit.year):
      case (unit === DateUnit.quarter):
      case (unit === DateUnit.month):
      case (unit === DateUnit.week):
      case (unit === DateUnit.day):
      case (unit === DateUnit.hour):
      case (unit === DateUnit.minute):
      case (unit === DateUnit.second):
        return value > 0 ?
          `in ${value} ${unit}s` :
          `${-value} ${unit}s ago`;
    }
  }

  throw new RangeError(`Invalid unit argument for format() '${unit}'`);
}
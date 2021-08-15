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
const Unit = {
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
    return formatRelativeTime(year, Unit.year);
  } else if (Math.abs(day) >= 30) {
    return formatRelativeTime(month, Unit.month);
  } else if (Math.abs(hr) >= 24) {
    return formatRelativeTime(day, Unit.day);
  } else if (Math.abs(min) >= 45) {
    return formatRelativeTime(hr, Unit.hour);
  } else if (Math.abs(sec) >= 45) {
    return formatRelativeTime(min, Unit.minute);
  } else if (Math.abs(sec) >= 10) {
    return formatRelativeTime(sec, Unit.second);
  } else {
    return formatRelativeTime(0, Unit.second);
  }
}

/**
 * @param {number} value Number of milliseconds between two dates
 * @param {Unit[keyof Unit]} unit Date format unit `year`, `quarter`, `month` etc.
 * @returns {string}
 */
function formatRelativeTime(value, unit) {
  if (value === 0) {
    switch (true) {
      case (unit === Unit.year):
      case (unit === Unit.quarter):
      case (unit === Unit.month):
      case (unit === Unit.week):
        return `this ${unit}`;
      case (unit === Unit.day):
        return 'today';
      case (unit === Unit.hour):
      case (unit === Unit.minute):
        return `in 0 ${unit}s`;
      case (unit === Unit.second):
        return 'now';
    }
  } else if (Math.abs(value) === 1) {
    switch (true) {
      case (unit === Unit.year):
      case (unit === Unit.quarter):
      case (unit === Unit.month):
      case (unit === Unit.week):
        return value > 0 ?
          `next ${unit}` :
          `last ${unit}`;
      case (unit === Unit.day):
        return value > 0 ?
          'tomorrow' :
          'yesterday';
      case (unit === Unit.hour):
      case (unit === Unit.minute):
      case (unit === Unit.second):
        return value > 0 ?
          `in 1 ${unit}` :
          `1 ${unit} ago`;
    }
  } else {
    switch (true) {
      case (unit === Unit.year):
      case (unit === Unit.quarter):
      case (unit === Unit.month):
      case (unit === Unit.week):
      case (unit === Unit.day):
      case (unit === Unit.hour):
      case (unit === Unit.minute):
      case (unit === Unit.second):
        return value > 0 ?
          `in ${value} ${unit}s` :
          `${-value} ${unit}s ago`;
    }
  }

  throw new RangeError(`Invalid unit argument for format() '${unit}'`);
}
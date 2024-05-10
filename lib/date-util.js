import { convertTimezoneToLocal, DAY_OF_WEEK } from './date';

/**
 * @typedef CountWeekendsBetweenOptions
 * @property {DAY_OF_WEEK[]?} weekendDays List of weekends` id (0 - sunday, 1 - monday, 6 - saturday)
 * @property {string} [timezone] Timezone for date comparison
 *
 * @description Count number of weekends between two dates inclusive
 * @param {number} from From date timestamp
 * @param {number} to To date timestamp
 * @param {CountWeekendsBetweenOptions} [options]
 * @returns {number} Number of weekends between two dates
 */
export function countWeekendsBetween(from, to, options) {
  const weekendDays = options?.weekendDays ?? [DAY_OF_WEEK.SUNDAY, DAY_OF_WEEK.SATURDAY];
  const timezone = options?.timezone;
  const dateFrom = convertTimezoneToLocal(new Date(from), timezone, true);
  const dateTo = convertTimezoneToLocal(new Date(to), timezone, true);

  [dateFrom, dateTo].forEach((date) => {
    date.setHours(0, 0, 0, 0);
  });

  const fromMidnight = convertTimezoneToLocal(
    dateFrom,
    timezone,
    false
  ).getTime();
  const toMidnight = convertTimezoneToLocal(
    dateTo,
    timezone,
    false
  ).getTime();

  const numberOfDays = Math.floor(
    (toMidnight - fromMidnight) / (24 * 60 * 60 * 1000)
  );

  return (
    weekendDays.length * Math.floor(numberOfDays / 7) +
    weekendDays.reduce((n, id) => {
      const dayFrom = dateFrom.getDay();
      const dayTo = (dayFrom + (numberOfDays % 7)) % 7;
      const leqTo = toMidnight === to ?
        id < dayTo :
        id <= dayTo;
      return (
        dayFrom > dayTo
          ? (id >= dayFrom || leqTo ? n + 1 : n)
          : (id >= dayFrom && leqTo ? n + 1 : n)
      );
    }, 0)
  );
}

/**
 * @param {number} year
 * @returns {boolean} returns true if leap year
 */
export function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/**
 * @typedef WeekDayOptions
 * @property {number} [after]
 * @property {number} [hours]
 * @property {number} [minutes]
 * @property {number} [seconds]
 * @property {number} [milliseconds]
 * @property {string} [timezone]
 * @param {DAY_OF_WEEK} dayId
 * @param {WeekDayOptions} options
 * @returns {number} Returns timestamp for passed week day in specified timezone
 */
export function weekDay(
  dayId,
  {
    after,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
    timezone
  } = {}
) {
  const date = convertTimezoneToLocal(
    new Date(after ?? Date.now()),
    timezone,
    true
  );
  if (after && dayId === date.getDay()) {
    date.setDate(date.getDate() + 1);
  }
  while (date.getDay() !== dayId) {
    date.setDate(date.getDate() + 1);
  }
  date.setHours(hours, minutes, seconds, milliseconds);
  return convertTimezoneToLocal(date, timezone, false).getTime();
}

/**
 * @param {Date|null} day1
 * @param {Date|null} day2
 * @returns {boolean}
 */
export function isSameDay(day1, day2) {
  return (!day1 || !day2) ? false : (
    day1.getDate() === day2.getDate() &&
    day1.getMonth() === day2.getMonth() &&
    day1.getFullYear() === day2.getFullYear()
  );
}

/**
 * @description Get timezone offset in minutes using Browser IANA Time Zone Database
 * @param {Date} date
 * @param {string} timezone TZ database name (e.g. "Europe/Moscow", "America/New_York", etc.)
 * @returns {number|null}
 */
export function getTimeZoneOffset(date, timezone) {
  const str = date.toLocaleString('en-GB', {
    timeZone: timezone,
    timeZoneName: 'short'
  });
  const dateRegExp = /^\d\d\/\d\d\/\d{4}, \d\d?:\d\d:\d\d (GMT([-+]\d\d?)?)/;
  const match = str.match(dateRegExp);
  if (match) {
    const offset =
      parseInt(
        match[2] || '+0' /*For timezone +00:00 it returns just GMT*/,
        10
      ) * 60;
    return -1 * offset;
  }
  return null;
}
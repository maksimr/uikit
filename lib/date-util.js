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
    date.setHours(0);
    date.setMinutes(0);
    date.setMilliseconds(0);
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

  const ndays = Math.floor(
    (toMidnight - fromMidnight) / (24 * 60 * 60 * 1000)
  );

  return (
    weekendDays.length * Math.floor(ndays / 7) +
    weekendDays.reduce((n, id) => {
      const dayFrom = dateFrom.getDay();
      const dayTo = (dayFrom + (ndays % 7)) % 7;
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
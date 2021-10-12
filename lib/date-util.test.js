import { DAY_OF_WEEK } from './date';
import { countWeekendsBetween } from './date-util';

describe('date-util', function() {
  /**@type {number}*/
  let timestamp;
  beforeEach(function() {
    timestamp = 0;
    jest.useFakeTimers('modern');
    jest.setSystemTime(timestamp);
  });

  describe('countWeekendsBetween', function() {
    const monday = weekday.bind(null, DAY_OF_WEEK.MONDAY);
    const sunday = weekday.bind(null, DAY_OF_WEEK.SUNDAY);

    it('should count weekends from monday to sunday', function() {
      expect(
        countWeekendsBetween(monday(), sunday({ after: monday() }))
      ).toEqual(2);
    });

    it('should count weekends from monday to monday', function() {
      expect(
        countWeekendsBetween(monday(), monday({ after: monday() }))
      ).toEqual(2);
    });

    it('should count weekends for one day', function() {
      expect(
        countWeekendsBetween(monday(), monday())
      ).toEqual(0);
    });

    it('should count weekends for date with hours & minutes', function() {
      const friday = weekday(DAY_OF_WEEK.FRIDAY, { hours: 8 });
      const sartuday = weekday(DAY_OF_WEEK.SATURDAY, { minutes: 5 });
      expect(
        countWeekendsBetween(friday, sartuday)
      ).toEqual(1);
    });

    it('should count custom list of weekends', function() {
      expect(
        countWeekendsBetween(monday(), sunday({ after: monday() }), {
          weekendDays: [DAY_OF_WEEK.SUNDAY, DAY_OF_WEEK.MONDAY, DAY_OF_WEEK.TUESDAY]
        })
      ).toEqual(3);
    });
  });

  /**
   * @param {DAY_OF_WEEK} dayId
   * @param {{after?: number, hours?: number, minutes?: number}} options
   * @returns {number}
   */
  function weekday(dayId, { after, hours = 0, minutes = 0 } = {}) {
    const date = new Date(after ?? Date.now());
    if (after && dayId === date.getDay()) {
      date.setDate(date.getDate() + 1);
    }
    while (date.getDay() !== dayId) {
      date.setDate(date.getDate() + 1);
    }
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.getTime();
  }
});
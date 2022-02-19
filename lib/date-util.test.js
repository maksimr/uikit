import { DAY_OF_WEEK } from './date';
import { countWeekendsBetween, dateTimeZoneOffset, isLeapYear, isSameDay, weekDay } from './date-util';
import { setSystemTime, useFakeTimers } from './../test/test-util';

describe('date-util', function() {
  /**@type {number}*/
  let timestamp;
  beforeEach(function() {
    timestamp = 0;
    useFakeTimers();
    setSystemTime(timestamp);
  });

  describe('countWeekendsBetween', function() {
    const monday = weekDay.bind(null, DAY_OF_WEEK.MONDAY);
    const sunday = weekDay.bind(null, DAY_OF_WEEK.SUNDAY);

    it('should count weekends from monday to sunday', function() {
      expect(
        countWeekendsBetween(monday(), sunday({ after: monday() }))
      ).toEqual(1);
    });

    it('should count weekends from sunday to sunday excluding the second sunday because it start at midnight', function() {
      expect(
        countWeekendsBetween(sunday(), sunday({ after: sunday() }))
      ).toEqual(2);
    });

    it('should count weekends from sunday to sunday including the second sunday because it`s not a midnight', function() {
      expect(
        countWeekendsBetween(sunday(), sunday({ after: sunday(), milliseconds: 1 }))
      ).toEqual(3);
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
      const friday = weekDay(DAY_OF_WEEK.FRIDAY, { hours: 8 });
      const sartuday = weekDay(DAY_OF_WEEK.SATURDAY, { minutes: 5 });
      expect(
        countWeekendsBetween(friday, sartuday)
      ).toEqual(1);
    });

    it('should count custom list of weekends', function() {
      expect(
        countWeekendsBetween(monday(), sunday({ after: monday(), milliseconds: 1 }), {
          weekendDays: [DAY_OF_WEEK.SUNDAY, DAY_OF_WEEK.MONDAY, DAY_OF_WEEK.TUESDAY]
        })
      ).toEqual(3);
    });
  });

  describe('isLeapYear', function() {
    it('should return true if year divided by 4', function() {
      expect(isLeapYear(4)).toBe(true);
    });

    it('should return false if year divided by 4 and 100', function() {
      expect(isLeapYear(200)).toBe(false);
    });

    it('should return true for years which divided by 400', function() {
      expect(isLeapYear(2000)).toBe(true);
    });
  });

  describe('isSameDay', function() {
    it('should return true for same day', function() {
      expect(isSameDay(new Date(), new Date())).toEqual(true);
    });

    it('should ignore time', function() {
      const day1 = new Date();
      day1.setHours(0, 0, 0, 0);
      const day2 = new Date(day1.valueOf());
      day2.setHours(10, 0, 0, 0);
      expect(isSameDay(day1, day2)).toEqual(true);
    });

    it('should return false if passed dates are diffirent days', function() {
      const day1 = new Date();
      day1.setDate(1);
      const day2 = new Date(day1.valueOf());
      day2.setDate(2);
      expect(isSameDay(day1, day2)).toEqual(false);
    });

    it('should return false for null values', function() {
      expect(isSameDay(null, new Date())).toEqual(false);
      expect(isSameDay(new Date(), null)).toEqual(false);
    });
  });

  describe('dateTimeZoneOffset', function() {
    it('should return time zone offset in minutes using browser database', function() {
      expect(dateTimeZoneOffset(new Date(0), 'Europe/London')).toEqual(-60);
      expect(dateTimeZoneOffset(new Date(0), 'America/Los_Angeles')).toEqual(480);
    });
  });
});
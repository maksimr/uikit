import { convertTimezoneToLocal, strftime, parse } from './date';
import { setSystemTime, useFakeTimers } from '../test/test-util';

describe('date', function() {
  /**@type {number}*/
  let timestamp;
  beforeEach(function() {
    timestamp = 1579600800000;
    useFakeTimers();
    setSystemTime(timestamp);
  });

  it('should format date with default formatter', function() {
    expect(strftime(timestamp)).toEqual('Jan 21, 2020');
  });

  it('should format date by predefined formatter', function() {
    expect(strftime(timestamp, 'fullDate')).toEqual('Tuesday, January 21, 2020');
  });

  it('should format date using simple date format', function() {
    expect(strftime(timestamp, 'MMM/dd/yy')).toEqual('Jan/21/20');
  });

  it('should use custom timezone', function() {
    expect(strftime(timestamp, 'shortTime', '+04:00')).toEqual('2:00 PM');
  });

  it('should use custom timezone in numberical format', function() {
    expect(strftime(timestamp, 'shortTime', -240)).toEqual('2:00 PM');
  });

  it('should correctly handle zero offset', function() {
    expect(strftime(timestamp, 'shortTime', 0)).toEqual('10:00 AM');
  });

  it('should use custom timezone in GMT format', function() {
    expect(strftime(timestamp, 'shortTime', 'GMT+0400')).toEqual('2:00 PM');
  });

  it('should allow to pass custom formatter and locale', function() {
    expect(strftime(timestamp, (/**@type {Date}*/date) => `-${date.getDay()}-`)).toEqual('-2-');
  });

  describe('convertTimezoneToLocal', function() {
    it('should convert local date to the date in specific timezone', function() {
      const date = new Date();

      // ⚠️
      // Get a date object in the timezone +04:00 for passed date.
      // Be careful timezone date containing the wrong timestamp because under the hood we use
      // the standard Date object which is always in *local timezone*.
      // We want to use this object if we need to pass a Date object
      // to a code which relays on Date object interface(.getHours, getMonth etc.) to the present
      // date in UI.
      // You should not pass this object to the server
      const dateTimezone = convertTimezoneToLocal(date, '+04:00', true);
      expect(dateTimezone.getHours()).toEqual(14);
    });

    it('should convert timezone date to the local date', function() {
      const dateTimezone = convertTimezoneToLocal(new Date(), '+04:00', true);

      // Convert date object which presented to the user in specific timezone.
      // to the date object in local timezone, which contains valid timestamp, so
      // we can send timestamp from this date object to the server.
      // Usually we can get this object from the code which present date in the UI and allow to change it
      // like date picker or date input.
      // Because this controls can present date in timezone different from the local
      // timezone, so we should convert this timezone date to the local date with correct timestamp
      const date = convertTimezoneToLocal(dateTimezone, '+04:00', false);
      expect(date.getTime()).toEqual(timestamp);
    });
  });

  describe('parse', function() {
    it('should parse string to date', function() {
      let date = parse('10 01 2010', 'dd MM yyyy');
      expect(date?.getFullYear()).toEqual(2010);
    });

    it('should return null if pass not valid date string', () => {
      expect(parse('foo', 'dd MM yyyy')).toEqual(null);
    });

    it('should parse date format with spaces', () => {
      const date = parse('10 Jan 2010', 'dd MMM yyyy');
      expect(date?.getMonth()).toEqual(0);
    });

    it('should parse short string month', () => {
      const date = parse('10/Jan/2010', 'dd/MMM/yyyy');
      expect(date?.getMonth()).toEqual(0);
    });

    it('should ignore trailing and leading spaces', () => {
      let date = parse('  10/Jan/2010  ', 'dd/MMM/yyyy');
      expect(date?.getMonth()).toEqual(0);

      date = parse('   10 Jan 2010   ', 'dd MMM yyyy');
      expect(date?.getMonth()).toEqual(0);
    });

    it('should ignore spaces between', () => {
      let date = parse('  10 / Jan / 2010  ', 'dd/MMM/yyyy');
      expect(date?.getMonth()).toEqual(0);

      date = parse('   10   Jan   2010   ', 'dd MMM yyyy');
      expect(date?.getMonth()).toEqual(0);
    });

    it('should returns null if string does not match date format', () => {
      const date = parse('10 Jan 2010KKK', 'dd MMM yyyy');
      expect(date).toEqual(null);
    });

    it('should parse double digit year dd/MM/yy', () => {
      const date = parse('10/01/10', 'dd/MM/yy');
      expect(date?.getFullYear()).toEqual(2010);
      expect(date?.getMonth()).toEqual(0);
      expect(date?.getDate()).toEqual(10);
    });

    it('should parse double digit day d/M/yy', () => {
      const date = parse('10/01/10', 'd/M/yy');
      expect(date?.getFullYear()).toEqual(2010);
      expect(date?.getMonth()).toEqual(0);
      expect(date?.getDate()).toEqual(10);
    });

    it('should parse hours', () => {
      let date = parse('12', 'hh');
      expect(date?.getHours()).toEqual(12);

      date = parse('12', 'h');
      expect(date?.getHours()).toEqual(12);

      date = parse('12', 'HH');
      expect(date?.getHours()).toEqual(12);
    });

    it('should parse minutes', () => {
      let date = parse('12', 'mm');
      expect(date?.getMinutes()).toEqual(12);

      date = parse('12', 'm');
      expect(date?.getMinutes()).toEqual(12);
    });

    it('should parse string in in specific timezone to the local date', () => {
      const date = parse('21/01/2020 14:00:00:000', 'd/MM/yyyy HH:mm:ss:sss', {
        timezone: '+04:00'
      });
      expect(date?.getTime()).toEqual(timestamp);
    });

    it('should not parse the date if it does not match the case', () => {
      const date = parse('10 JAN 2010', 'dd MMM yyyy');
      expect(date).toEqual(null);
    });

    it('should parse the date ignoring case', () => {
      expect(parse('10 jAN 2010', 'dd MMM yyyy', { ignoreCase: true })?.getMonth()).toEqual(0);
      expect(parse('10 jan 2010', 'dd MMM yyyy', { ignoreCase: true })?.getMonth()).toEqual(0);
    });
  });
});
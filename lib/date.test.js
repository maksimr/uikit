import { convertTimezoneToLocal, strftime, parse } from './date';
import { setSystemTime, useFakeTimers } from '../test/test-util';

describe('date', function() {
  const mediumFormat = 'MMM d, y h:mm:ss a';
  const fullDateFormat = 'EEEE, MMMM d, y';

  /**@type {number}*/
  let timestamp;
  beforeEach(function() {
    timestamp = 1579600800000;
    useFakeTimers();
    setSystemTime(timestamp);
  });

  it('should format year', function() {
    const offset = 0;
    const timestamp0001 = -62135596800000; // 1 year
    const timestamp0044 = -60778684800000; // 44 years
    const timestamp1900 = -2208988800000; // 1900 year
    const timestamp2017 = 1483228800000; // 2017 year

    expect(strftime(timestamp0001, 'yyyy', offset)).toEqual('0001');
    expect(strftime(timestamp0044, 'yyyy', offset)).toEqual('0044');
    expect(strftime(timestamp1900, 'yyyy', offset)).toEqual('1900');
    expect(strftime(timestamp2017, 'yyyy', offset)).toEqual('2017');

    expect(strftime(timestamp0001, 'yy', offset)).toEqual('01');
    expect(strftime(timestamp0044, 'yy', offset)).toEqual('44');
    expect(strftime(timestamp1900, 'yy', offset)).toEqual('00');
    expect(strftime(timestamp2017, 'yy', offset)).toEqual('17');

    expect(strftime(timestamp0001, 'y', offset)).toEqual('1');
    expect(strftime(timestamp0044, 'y', offset)).toEqual('44');
    expect(strftime(timestamp1900, 'y', offset)).toEqual('1900');
    expect(strftime(timestamp2017, 'y', offset)).toEqual('2017');
  });

  it('should format month', function() {
    const offset = 0;
    const timestampJan = 1546300800000; // Jan
    const timestampFeb = 1548979200000; // Feb
    const timestampMar = 1551398400000; // Mar
    const timestampApr = 1554076800000; // Apr
    const timestampMay = 1556668800000; // May
    const timestampJun = 1559347200000; // Jun
    const timestampJul = 1561939200000; // Jul
    const timestampAug = 1564617600000; // Aug
    const timestampSep = 1567296000000; // Sep
    const timestampOct = 1569888000000; // Oct
    const timestampNov = 1572566400000; // Nov
    const timestampDec = 1575158400000; // Dec

    expect(strftime(timestampJan, 'MMMM', offset)).toEqual('January');
    expect(strftime(timestampFeb, 'MMMM', offset)).toEqual('February');
    expect(strftime(timestampMar, 'MMMM', offset)).toEqual('March');
    expect(strftime(timestampApr, 'MMMM', offset)).toEqual('April');
    expect(strftime(timestampMay, 'MMMM', offset)).toEqual('May');
    expect(strftime(timestampJun, 'MMMM', offset)).toEqual('June');
    expect(strftime(timestampJul, 'MMMM', offset)).toEqual('July');
    expect(strftime(timestampAug, 'MMMM', offset)).toEqual('August');
    expect(strftime(timestampSep, 'MMMM', offset)).toEqual('September');
    expect(strftime(timestampOct, 'MMMM', offset)).toEqual('October');
    expect(strftime(timestampNov, 'MMMM', offset)).toEqual('November');
    expect(strftime(timestampDec, 'MMMM', offset)).toEqual('December');

    expect(strftime(timestampJan, 'MMM', offset)).toEqual('Jan');
    expect(strftime(timestampFeb, 'MMM', offset)).toEqual('Feb');
    expect(strftime(timestampMar, 'MMM', offset)).toEqual('Mar');
    expect(strftime(timestampApr, 'MMM', offset)).toEqual('Apr');
    expect(strftime(timestampMay, 'MMM', offset)).toEqual('May');
    expect(strftime(timestampJun, 'MMM', offset)).toEqual('Jun');
    expect(strftime(timestampJul, 'MMM', offset)).toEqual('Jul');
    expect(strftime(timestampAug, 'MMM', offset)).toEqual('Aug');
    expect(strftime(timestampSep, 'MMM', offset)).toEqual('Sep');
    expect(strftime(timestampOct, 'MMM', offset)).toEqual('Oct');
    expect(strftime(timestampNov, 'MMM', offset)).toEqual('Nov');
    expect(strftime(timestampDec, 'MMM', offset)).toEqual('Dec');

    expect(strftime(timestampJan, 'MM', offset)).toEqual('01');
    expect(strftime(timestampFeb, 'MM', offset)).toEqual('02');
    expect(strftime(timestampMar, 'MM', offset)).toEqual('03');
    expect(strftime(timestampApr, 'MM', offset)).toEqual('04');
    expect(strftime(timestampMay, 'MM', offset)).toEqual('05');
    expect(strftime(timestampJun, 'MM', offset)).toEqual('06');
    expect(strftime(timestampJul, 'MM', offset)).toEqual('07');
    expect(strftime(timestampAug, 'MM', offset)).toEqual('08');
    expect(strftime(timestampSep, 'MM', offset)).toEqual('09');
    expect(strftime(timestampOct, 'MM', offset)).toEqual('10');
    expect(strftime(timestampNov, 'MM', offset)).toEqual('11');
    expect(strftime(timestampDec, 'MM', offset)).toEqual('12');

    expect(strftime(timestampJan, 'M', offset)).toEqual('1');
    expect(strftime(timestampFeb, 'M', offset)).toEqual('2');
    expect(strftime(timestampMar, 'M', offset)).toEqual('3');
    expect(strftime(timestampApr, 'M', offset)).toEqual('4');
    expect(strftime(timestampMay, 'M', offset)).toEqual('5');
    expect(strftime(timestampJun, 'M', offset)).toEqual('6');
    expect(strftime(timestampJul, 'M', offset)).toEqual('7');
    expect(strftime(timestampAug, 'M', offset)).toEqual('8');
    expect(strftime(timestampSep, 'M', offset)).toEqual('9');
    expect(strftime(timestampOct, 'M', offset)).toEqual('10');
    expect(strftime(timestampNov, 'M', offset)).toEqual('11');
    expect(strftime(timestampDec, 'M', offset)).toEqual('12');

    expect(strftime(timestampJan, 'LLLL', offset)).toEqual('January');
    expect(strftime(timestampFeb, 'LLLL', offset)).toEqual('February');
    expect(strftime(timestampMar, 'LLLL', offset)).toEqual('March');
    expect(strftime(timestampApr, 'LLLL', offset)).toEqual('April');
    expect(strftime(timestampMay, 'LLLL', offset)).toEqual('May');
    expect(strftime(timestampJun, 'LLLL', offset)).toEqual('June');
    expect(strftime(timestampJul, 'LLLL', offset)).toEqual('July');
    expect(strftime(timestampAug, 'LLLL', offset)).toEqual('August');
    expect(strftime(timestampSep, 'LLLL', offset)).toEqual('September');
    expect(strftime(timestampOct, 'LLLL', offset)).toEqual('October');
    expect(strftime(timestampNov, 'LLLL', offset)).toEqual('November');
    expect(strftime(timestampDec, 'LLLL', offset)).toEqual('December');
  });

  it('should format day of month', function() {
    const offset = 0;
    const timestamp01 = 1483228800000; // Jan 01
    const timestamp09 = 1483920000000; // Jan 09
    const timestamp10 = 1484025600000; // Jan 10
    const timestamp21 = 1484956800000; // Jan 21
    const timestamp31 = 1485820800000; // Jan 31

    expect(strftime(timestamp01, 'dd', offset)).toEqual('01');
    expect(strftime(timestamp09, 'dd', offset)).toEqual('09');
    expect(strftime(timestamp10, 'dd', offset)).toEqual('10');
    expect(strftime(timestamp21, 'dd', offset)).toEqual('21');
    expect(strftime(timestamp31, 'dd', offset)).toEqual('31');

    expect(strftime(timestamp01, 'd', offset)).toEqual('1');
    expect(strftime(timestamp09, 'd', offset)).toEqual('9');
    expect(strftime(timestamp10, 'd', offset)).toEqual('10');
    expect(strftime(timestamp21, 'd', offset)).toEqual('21');
    expect(strftime(timestamp31, 'd', offset)).toEqual('31');
  });

  it('should format day of week', function() {
    const offset = 0;
    const timestampSun = 1483228800000; // Sunday
    const timestampMon = 1483315200000; // Monday
    const timestampTue = 1483401600000; // Tuesday
    const timestampWed = 1483488000000; // Wednesday
    const timestampThu = 1483574400000; // Thursday
    const timestampFri = 1483660800000; // Friday
    const timestampSat = 1483747200000; // Saturday

    expect(strftime(timestampSun, 'EEEE', offset)).toEqual('Sunday');
    expect(strftime(timestampMon, 'EEEE', offset)).toEqual('Monday');
    expect(strftime(timestampTue, 'EEEE', offset)).toEqual('Tuesday');
    expect(strftime(timestampWed, 'EEEE', offset)).toEqual('Wednesday');
    expect(strftime(timestampThu, 'EEEE', offset)).toEqual('Thursday');
    expect(strftime(timestampFri, 'EEEE', offset)).toEqual('Friday');
    expect(strftime(timestampSat, 'EEEE', offset)).toEqual('Saturday');

    expect(strftime(timestampSun, 'EEE', offset)).toEqual('Sun');
    expect(strftime(timestampMon, 'EEE', offset)).toEqual('Mon');
    expect(strftime(timestampTue, 'EEE', offset)).toEqual('Tue');
    expect(strftime(timestampWed, 'EEE', offset)).toEqual('Wed');
    expect(strftime(timestampThu, 'EEE', offset)).toEqual('Thu');
    expect(strftime(timestampFri, 'EEE', offset)).toEqual('Fri');
    expect(strftime(timestampSat, 'EEE', offset)).toEqual('Sat');
  });

  it('should format hours', function() {
    const offset = 0;
    const timestamp00 = 1483228800000; // 00:00
    const timestamp01 = 1483232400000; // 01:00
    const timestamp09 = 1483261200000; // 09:00
    const timestamp10 = 1483264800000; // 10:00
    const timestamp12 = 1483272000000; // 12:00
    const timestamp13 = 1483275600000; // 13:00
    const timestamp23 = 1483311600000; // 23:00

    expect(strftime(timestamp00, 'HH', offset)).toEqual('00');
    expect(strftime(timestamp01, 'HH', offset)).toEqual('01');
    expect(strftime(timestamp09, 'HH', offset)).toEqual('09');
    expect(strftime(timestamp10, 'HH', offset)).toEqual('10');
    expect(strftime(timestamp12, 'HH', offset)).toEqual('12');
    expect(strftime(timestamp13, 'HH', offset)).toEqual('13');
    expect(strftime(timestamp23, 'HH', offset)).toEqual('23');

    expect(strftime(timestamp00, 'H', offset)).toEqual('0');
    expect(strftime(timestamp01, 'H', offset)).toEqual('1');
    expect(strftime(timestamp09, 'H', offset)).toEqual('9');
    expect(strftime(timestamp10, 'H', offset)).toEqual('10');
    expect(strftime(timestamp12, 'H', offset)).toEqual('12');
    expect(strftime(timestamp13, 'H', offset)).toEqual('13');
    expect(strftime(timestamp23, 'H', offset)).toEqual('23');

    expect(strftime(timestamp00, 'hh', offset)).toEqual('12');
    expect(strftime(timestamp01, 'hh', offset)).toEqual('01');
    expect(strftime(timestamp09, 'hh', offset)).toEqual('09');
    expect(strftime(timestamp10, 'hh', offset)).toEqual('10');
    expect(strftime(timestamp12, 'hh', offset)).toEqual('12');
    expect(strftime(timestamp13, 'hh', offset)).toEqual('01');
    expect(strftime(timestamp23, 'hh', offset)).toEqual('11');

    expect(strftime(timestamp00, 'h', offset)).toEqual('12');
    expect(strftime(timestamp01, 'h', offset)).toEqual('1');
    expect(strftime(timestamp09, 'h', offset)).toEqual('9');
    expect(strftime(timestamp10, 'h', offset)).toEqual('10');
    expect(strftime(timestamp12, 'h', offset)).toEqual('12');
    expect(strftime(timestamp13, 'h', offset)).toEqual('1');
    expect(strftime(timestamp23, 'h', offset)).toEqual('11');
  });

  it('should format AM/PM', function() {
    const offset = 0;
    const timestamp00 = 1483228800000; // 00:00
    const timestamp01 = 1483232400000; // 01:00
    const timestamp12 = 1483272000000; // 12:00
    const timestamp13 = 1483275600000; // 13:00
    const timestamp23 = 1483311600000; // 23:00

    expect(strftime(timestamp00, 'a', offset)).toEqual('AM');
    expect(strftime(timestamp01, 'a', offset)).toEqual('AM');
    expect(strftime(timestamp12, 'a', offset)).toEqual('PM');
    expect(strftime(timestamp13, 'a', offset)).toEqual('PM');
    expect(strftime(timestamp23, 'a', offset)).toEqual('PM');
  });

  it('should format minutes', function() {
    const offset = 0;
    const timestamp00 = 1483228800000; // 00:00
    const timestamp01 = 1483228860000; // 00:01
    const timestamp09 = 1483229340000; // 00:09
    const timestamp10 = 1483229400000; // 00:10
    const timestamp59 = 1483232340000; // 00:59

    expect(strftime(timestamp00, 'mm', offset)).toEqual('00');
    expect(strftime(timestamp01, 'mm', offset)).toEqual('01');
    expect(strftime(timestamp09, 'mm', offset)).toEqual('09');
    expect(strftime(timestamp10, 'mm', offset)).toEqual('10');
    expect(strftime(timestamp59, 'mm', offset)).toEqual('59');

    expect(strftime(timestamp00, 'm', offset)).toEqual('0');
    expect(strftime(timestamp01, 'm', offset)).toEqual('1');
    expect(strftime(timestamp09, 'm', offset)).toEqual('9');
    expect(strftime(timestamp10, 'm', offset)).toEqual('10');
    expect(strftime(timestamp59, 'm', offset)).toEqual('59');
  });

  it('should format seconds', function() {
    const offset = 0;
    const timestamp00 = 1483228800000; // 00:00:00
    const timestamp01 = 1483228801000; // 00:00:01
    const timestamp09 = 1483228809000; // 00:00:09
    const timestamp10 = 1483228810000; // 00:00:10
    const timestamp59 = 1483228859000; // 00:00:59

    expect(strftime(timestamp00, 'ss', offset)).toEqual('00');
    expect(strftime(timestamp01, 'ss', offset)).toEqual('01');
    expect(strftime(timestamp09, 'ss', offset)).toEqual('09');
    expect(strftime(timestamp10, 'ss', offset)).toEqual('10');
    expect(strftime(timestamp59, 'ss', offset)).toEqual('59');

    expect(strftime(timestamp00, 's', offset)).toEqual('0');
    expect(strftime(timestamp01, 's', offset)).toEqual('1');
    expect(strftime(timestamp09, 's', offset)).toEqual('9');
    expect(strftime(timestamp10, 's', offset)).toEqual('10');
    expect(strftime(timestamp59, 's', offset)).toEqual('59');
  });

  it('should format milliseconds', function() {
    const offset = 0;
    const timestamp000 = 1483228800000; // 00:00:00.000
    const timestamp001 = 1483228800001; // 00:00:00.001
    const timestamp009 = 1483228800009; // 00:00:00.009
    const timestamp010 = 1483228800010; // 00:00:00.010
    const timestamp099 = 1483228800099; // 00:00:00.099
    const timestamp100 = 1483228800100; // 00:00:00.100
    const timestamp999 = 1483228800999; // 00:00:00.999

    expect(strftime(timestamp000, 'sss', offset)).toEqual('000');
    expect(strftime(timestamp001, 'sss', offset)).toEqual('001');
    expect(strftime(timestamp009, 'sss', offset)).toEqual('009');
    expect(strftime(timestamp010, 'sss', offset)).toEqual('010');
    expect(strftime(timestamp099, 'sss', offset)).toEqual('099');
    expect(strftime(timestamp100, 'sss', offset)).toEqual('100');
    expect(strftime(timestamp999, 'sss', offset)).toEqual('999');
  });

  it('should format timezone', function() {
    const timestamp = 1483228800000; // 2017-01-01T00:00:00.000Z
    expect(strftime(timestamp, 'Z', 0)).toEqual('+0000');
    expect(strftime(timestamp, 'Z', -60)).toEqual('+0100');
    expect(strftime(timestamp, 'Z', 60)).toEqual('-0100');
  });

  it('should format week of year', function() {
    const offset = 0;
    const timestampW01 = 1483228800000; // Jan 01, 2017
    const timestampW02 = 1483833600000; // Jan 08, 2017
    const timestampW03 = 1484438400000; // Jan 15, 2017
    const timestampW04 = 1485043200000; // Jan 22, 2017
    const timestampW05 = 1485648000000; // Jan 29, 2017
    const timestampW06 = 1486252800000; // Feb 05, 2017
    const timestampW53 = 1514678400000; // Dec 31, 2017

    expect(strftime(timestampW01, 'ww', offset)).toEqual('01');
    expect(strftime(timestampW02, 'ww', offset)).toEqual('02');
    expect(strftime(timestampW03, 'ww', offset)).toEqual('03');
    expect(strftime(timestampW04, 'ww', offset)).toEqual('04');
    expect(strftime(timestampW05, 'ww', offset)).toEqual('05');
    expect(strftime(timestampW06, 'ww', offset)).toEqual('06');
    expect(strftime(timestampW53, 'ww', offset)).toEqual('53');

    expect(strftime(timestampW01, 'w', offset)).toEqual('1');
    expect(strftime(timestampW02, 'w', offset)).toEqual('2');
    expect(strftime(timestampW03, 'w', offset)).toEqual('3');
    expect(strftime(timestampW04, 'w', offset)).toEqual('4');
    expect(strftime(timestampW05, 'w', offset)).toEqual('5');
    expect(strftime(timestampW06, 'w', offset)).toEqual('6');
    expect(strftime(timestampW53, 'w', offset)).toEqual('53');
  });

  it('should format era', function() {
    const offset = 0;
    const timestampBC = -63135596800000;
    const timestampAD = 1483228800000;

    expect(strftime(timestampBC, 'GGGG', offset)).toEqual('Before Christ');
    expect(strftime(timestampAD, 'GGGG', offset)).toEqual('Anno Domini');
    expect(strftime(timestampBC, 'GGG', offset)).toEqual('BC');
    expect(strftime(timestampAD, 'GGG', offset)).toEqual('AD');
    expect(strftime(timestampBC, 'GG', offset)).toEqual('BC');
    expect(strftime(timestampAD, 'GG', offset)).toEqual('AD');
    expect(strftime(timestampBC, 'G', offset)).toEqual('BC');
    expect(strftime(timestampAD, 'G', offset)).toEqual('AD');
  });

  it('should format date with default formatter', function() {
    expect(strftime(timestamp)).toEqual('Jan 21, 2020');
  });

  it('should format date by predefined formatter', function() {
    expect(strftime(timestamp, fullDateFormat)).toEqual('Tuesday, January 21, 2020');
  });

  it('should format date using simple date format', function() {
    expect(strftime(timestamp, 'MMM/dd/yy')).toEqual('Jan/21/20');
  });

  it('should allow escape sequences', function() {
    expect(strftime(timestamp, 'dd\'d\'')).toEqual('21d');
  });

  it('should use custom timezone', function() {
    expect(strftime(timestamp, mediumFormat, '+04:00')).toEqual('Jan 21, 2020 2:00:00 PM');
  });

  it('should use custom timezone in numberical format', function() {
    expect(strftime(timestamp, mediumFormat, -240)).toEqual('Jan 21, 2020 2:00:00 PM');
  });

  it('should correctly handle zero offset', function() {
    expect(strftime(timestamp, mediumFormat, 0)).toEqual('Jan 21, 2020 10:00:00 AM');
  });

  it('should use custom timezone in GMT format', function() {
    expect(strftime(timestamp, mediumFormat, 'GMT+0400')).toEqual('Jan 21, 2020 2:00:00 PM');
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
import { dateFilter, parse } from './date';

describe('date', function() {
  let date;
  beforeEach(function() {
    date = 1579602974121;
    jest.useFakeTimers('modern');
    jest.setSystemTime(date);
  });

  it('should format date with default formatter', function() {
    expect(dateFilter(date)).toEqual('Jan 21, 2020');
  });

  it('should format date by predefined formatter', function() {
    expect(dateFilter(date, 'fullDate')).toEqual('Tuesday, January 21, 2020');
  });

  it('should format date using simple date format', function() {
    expect(dateFilter(date, 'MMM/dd/yy')).toEqual('Jan/21/20');
  });

  it('should use custom timezone', function() {
    expect(dateFilter(date, 'shortTime', '+04:00')).toEqual('2:36 PM');
  });

  it('should use custom timezone in GMT format', function() {
    expect(dateFilter(date, 'shortTime', 'GMT+0400')).toEqual('2:36 PM');
  });

  it('should allow to pass custom formatter and locale', function() {
    expect(dateFilter(date, (date) => `-${date.getDay()}-`)).toEqual('-2-');
  });

  describe('parse', function() {
    it('should parse string to date', function() {
      let d = parse('10 01 2010', 'dd MM yyyy');
      expect(d.getFullYear()).toEqual(2010);
    });

    it('should return null if pass not valid date string', () => {
      expect(parse('foo', 'dd MM yyyy')).toEqual(null);
    });

    it('should parse date format with spaces', () => {
      const d = parse('10 Jan 2010', 'dd MMM yyyy');
      expect(d.getMonth()).toEqual(0);
    });

    it('should parse short string month', () => {
      const d = parse('10/Jan/2010', 'dd/MMM/yyyy');
      expect(d.getMonth()).toEqual(0);
    });

    it('should ignore trailing and leading spaces', () => {
      let d = parse('  10/Jan/2010  ', 'dd/MMM/yyyy');
      expect(d.getMonth()).toEqual(0);

      d = parse('   10 Jan 2010   ', 'dd MMM yyyy');
      expect(d.getMonth()).toEqual(0);
    });

    it("should ignore spaces between", () => {
      let d = parse('  10 / Jan / 2010  ', 'dd/MMM/yyyy');
      expect(d.getMonth()).toEqual(0);

      d = parse('   10   Jan   2010   ', 'dd MMM yyyy');
      expect(d.getMonth()).toEqual(0);
    });

    it('should returns null if string does not match date format', () => {
      const d = parse('10 Jan 2010KKK', 'dd MMM yyyy');
      expect(d).toEqual(null);
    });

    it("should parse double digit year dd/MM/yy", () => {
      const d = parse('10/01/10', 'dd/MM/yy');
      expect(d.getFullYear()).toEqual(2010);
      expect(d.getMonth()).toEqual(0);
      expect(d.getDate()).toEqual(10);
    });

    it('should parse double diget day d/M/yy', () => {
      const d = parse('10/01/10', 'd/M/yy');
      expect(d.getFullYear()).toEqual(2010);
      expect(d.getMonth()).toEqual(0);
      expect(d.getDate()).toEqual(10);
    });

    it('should parse hours', () => {
      let d = parse('12', 'hh');
      expect(d.getHours()).toEqual(12);

      d = parse('12', 'h');
      expect(d.getHours()).toEqual(12);

      d = parse('12', 'HH');
      expect(d.getHours()).toEqual(12);
    });

    it('should parse minutes', () => {
      let d = parse('12', 'mm');
      expect(d.getMinutes()).toEqual(12);

      d = parse('12', 'm');
      expect(d.getMinutes()).toEqual(12);
    });
  });
});
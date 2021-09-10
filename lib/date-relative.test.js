import { microTimeFromMs, timeAgoFromMs } from './date-relative';

describe('relative date', () => {
  /**@type {number}*/
  let timestamp;
  beforeEach(function() {
    timestamp = 1579600800000;
    jest.useFakeTimers('modern');
    jest.setSystemTime(timestamp);
  });

  it('should format interval as relative date in the future', () => {
    const ms = 1000;
    expect(timeAgoFromMs(0)).toEqual('now');
    expect(timeAgoFromMs(ms)).toEqual('now');
    expect(timeAgoFromMs(10 * ms)).toEqual('in 10 seconds');
    expect(timeAgoFromMs(45 * ms)).toEqual('in 1 minute');
    expect(timeAgoFromMs(60 * ms)).toEqual('in 1 minute');
    expect(timeAgoFromMs(1.5 * 60 * ms)).toEqual('in 2 minutes');
    expect(timeAgoFromMs(2 * 60 * ms)).toEqual('in 2 minutes');
    expect(timeAgoFromMs(45 * 60 * ms)).toEqual('in 1 hour');
    expect(timeAgoFromMs(90 * 60 * ms)).toEqual('in 2 hours');
    expect(timeAgoFromMs(24 * 60 * 60 * ms)).toEqual('tomorrow');
    expect(timeAgoFromMs(2 * 24 * 60 * 60 * ms)).toEqual('in 2 days');
    expect(timeAgoFromMs(30 * 24 * 60 * 60 * ms)).toEqual('next month');
    expect(timeAgoFromMs(2 * 30 * 24 * 60 * 60 * ms)).toEqual('in 2 months');
    expect(timeAgoFromMs(12 * 30 * 24 * 60 * 60 * ms)).toEqual('next year');
    expect(timeAgoFromMs(2 * 12 * 30 * 24 * 60 * 60 * ms)).toEqual('in 2 years');
  });

  it('should format interval as relative date in the past', () => {
    const ms = -1000;
    expect(timeAgoFromMs(0)).toEqual('now');
    expect(timeAgoFromMs(ms)).toEqual('now');
    expect(timeAgoFromMs(10 * ms)).toEqual('10 seconds ago');
    expect(timeAgoFromMs(45 * ms)).toEqual('1 minute ago');
    expect(timeAgoFromMs(60 * ms)).toEqual('1 minute ago');
    expect(timeAgoFromMs(2 * 60 * ms)).toEqual('2 minutes ago');
    expect(timeAgoFromMs(45 * 60 * ms)).toEqual('1 hour ago');
    expect(timeAgoFromMs(24 * 60 * 60 * ms)).toEqual('yesterday');
    expect(timeAgoFromMs(2 * 24 * 60 * 60 * ms)).toEqual('2 days ago');
    expect(timeAgoFromMs(30 * 24 * 60 * 60 * ms)).toEqual('last month');
    expect(timeAgoFromMs(2 * 30 * 24 * 60 * 60 * ms)).toEqual('2 months ago');
    expect(timeAgoFromMs(12 * 30 * 24 * 60 * 60 * ms)).toEqual('last year');
    expect(timeAgoFromMs(2 * 12 * 30 * 24 * 60 * 60 * ms)).toEqual('2 years ago');
  });

  it('should format relative date using mircro format', () => {
    expect(microTimeFromMs(0)).toEqual('1m');

    [1000, -1000].map((ms) => {
      expect(microTimeFromMs(ms)).toEqual('1m');
      expect(microTimeFromMs(10 * ms)).toEqual('1m');
      expect(microTimeFromMs(45 * ms)).toEqual('1m');
      expect(microTimeFromMs(60 * ms)).toEqual('1m');
      expect(microTimeFromMs(2 * 60 * ms)).toEqual('2m');
      expect(microTimeFromMs(60 * 60 * ms)).toEqual('1h');
      expect(microTimeFromMs(2 * 60 * 60 * ms)).toEqual('2h');
      expect(microTimeFromMs(24 * 60 * 60 * ms)).toEqual('1d');
      expect(microTimeFromMs(2 * 24 * 60 * 60 * ms)).toEqual('2d');
      expect(microTimeFromMs(2 * 30 * 24 * 60 * 60 * ms)).toEqual('60d');
      expect(microTimeFromMs(365 * 24 * 60 * 60 * ms)).toEqual('1y');
      expect(microTimeFromMs(2 * 365 * 24 * 60 * 60 * ms)).toEqual('2y');
    });
  });
});
import { throttle } from './throttle';
import { setSystemTime, useFakeTimers, advanceTimersByTime, createSpy } from './../test/test-util';

describe('throttle', function() {
  /**@type {(...args: *[])=>void}*/
  let fn;
  /**@type {number}*/
  let threshold;
  beforeEach(function() {
    useFakeTimers();
    setSystemTime(0);
    fn = createSpy();
    threshold = 100;
  });

  it('should throttle function', function() {
    const tfn = throttle(fn, threshold);
    tfn(1);
    expect(fn).toHaveBeenCalledWith(1);

    tfn(2);
    tfn(3);
    expect(fn).not.toHaveBeenCalledWith(2);

    advanceTimersByTime(threshold);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it('should cancel throttled call', function() {
    const tfn = throttle(fn, threshold);

    tfn(1);
    tfn(2);
    tfn(3);
    tfn.cancel();
    advanceTimersByTime(threshold);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);
  });
});
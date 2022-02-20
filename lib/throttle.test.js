import { throttle } from './throttle';
import { setSystemTime, useFakeTimers, advanceTimersByTime, createSpy } from './../test/test-util';

describe('throttle', function() {
  /**@type {(...args: *[])=>void}*/
  let fn;
  /**@type {number}*/
  let delay;
  beforeEach(function() {
    useFakeTimers();
    setSystemTime(0);
    fn = createSpy();
    delay = 100;
  });

  it('should throttle function', function() {
    const tfn = throttle(fn, delay);
    tfn(1, 2);
    tfn(3, 4);
    tfn(5);
    advanceTimersByTime(delay);

    expect(fn).toHaveBeenCalledWith(5);
  });

  it('should cancel throttled call', function() {
    const tfn = throttle(fn, delay);

    tfn();
    tfn();
    tfn();
    tfn.cancel();
    advanceTimersByTime(delay);

    expect(fn).toHaveBeenCalledTimes(0);
  });
});
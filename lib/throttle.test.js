import { throttle } from "./throttle";

describe('throttle', function() {
  let fn;
  let delay;
  beforeEach(function() {
    jest.useFakeTimers('modern');
    jest.setSystemTime(0);
    fn = jasmine.createSpy('fn');
    delay = 100;
  });

  it('should throttle function', function() {
    const tfn = throttle(fn, delay);
    tfn(1, 2);
    tfn(3, 4);
    tfn(5);
    jest.advanceTimersByTime(delay);

    expect(fn).toHaveBeenCalledWith(5);
  });

  it('should cancel throttled call', function() {
    const tfn = throttle(fn, delay);

    tfn();
    tfn();
    tfn();
    tfn.cancel();
    jest.advanceTimersByTime(delay);

    expect(fn).toHaveBeenCalledTimes(0);
  });
});
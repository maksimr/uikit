import { debounce } from './debounce';

describe('debounce', function() {
  /**@type {number}*/ let ms;
  /**@type {(n: number) => void}*/ let fn;
  /**@type {import('./debounce').DebouncedFunction<fn>}*/ let debouncedFn;
  beforeEach(function() {
    jest.useFakeTimers('modern');
    jest.setSystemTime(0);
    ms = 10;
    fn = jest.fn();
    debouncedFn = debounce(fn, ms);
  });

  it('should debounce function call', function() {
    debouncedFn(1);
    jest.advanceTimersByTime(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn(2);
    jest.advanceTimersByTime(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn(3);
    jest.advanceTimersByTime(ms);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith(3);
  });

  it('should cancel debounced function', function() {
    debouncedFn(1);
    jest.advanceTimersByTime(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn(2);
    jest.advanceTimersByTime(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn.cancel();
    jest.advanceTimersByTime(ms);
    expect(fn).not.toHaveBeenCalled();
  });
});
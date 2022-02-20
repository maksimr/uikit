import { debounce } from './debounce';
import { setSystemTime, useFakeTimers, advanceTimersByTime, createSpy } from './../test/test-util';

describe('debounce', function() {
  /**@type {number}*/ let ms;
  /**@type {(n: number) => void}*/ let fn;
  /**@type {import('./debounce').DebouncedFunction<fn>}*/ let debouncedFn;
  beforeEach(function() {
    useFakeTimers();
    setSystemTime(0);
    ms = 10;
    fn = createSpy();
    debouncedFn = debounce(fn, ms);
  });

  it('should debounce function call', function() {
    debouncedFn(1);
    advanceTimersByTime(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn(2);
    advanceTimersByTime(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn(3);
    advanceTimersByTime(ms);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith(3);
  });

  it('should cancel debounced function', function() {
    debouncedFn(1);
    advanceTimersByTime(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn(2);
    advanceTimersByTime(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn.cancel();
    advanceTimersByTime(ms);
    expect(fn).not.toHaveBeenCalled();
  });
});
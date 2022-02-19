import { debounce } from './debounce';
import { setSystemTime, useFakeTimers } from './../test/test-util';

describe('debounce', function() {
  /**@type {number}*/ let ms;
  /**@type {(n: number) => void}*/ let fn;
  /**@type {import('./debounce').DebouncedFunction<fn>}*/ let debouncedFn;
  beforeEach(function() {
    useFakeTimers();
    setSystemTime(0);
    ms = 10;
    fn = jasmine.createSpy();
    debouncedFn = debounce(fn, ms);
  });

  it('should debounce function call', function() {
    debouncedFn(1);
    jasmine.clock().tick(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn(2);
    jasmine.clock().tick(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn(3);
    jasmine.clock().tick(ms);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith(3);
  });

  it('should cancel debounced function', function() {
    debouncedFn(1);
    jasmine.clock().tick(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn(2);
    jasmine.clock().tick(ms - 1);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn.cancel();
    jasmine.clock().tick(ms);
    expect(fn).not.toHaveBeenCalled();
  });
});
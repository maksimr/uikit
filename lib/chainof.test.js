import { createSpy } from '../test/test-util';
import { chainof } from './chainof';

describe('chainof', function() {
  it('should add handler', function() {
    const fn = createSpy();
    const [add, run] = chainof();

    add(fn);
    run(1);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);
  });

  it('should remove handler', function() {
    const fn = createSpy();
    const [add, run] = chainof();

    const remove = add(fn);
    remove();
    run(1);

    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('should call next handler if returns undefind', function() {
    const fn = createSpy();
    const [add, run] = chainof();

    add(fn);
    add(fn);
    run(1);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith(1);
  });

  it('should allow call next handler progromatically', function() {
    const fn = createSpy();
    const [add, run] = chainof();

    add((_, next) => { next(); });
    add(fn);
    run(1);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);
  });

  it('should not call next handler if we don`t call next function', function() {
    const fn = createSpy();
    const [add, run] = chainof();

    add((_, next) => { (/*do nothing*/next); });
    add(fn);
    run(1);

    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('should not call next handler if previous returns value', function() {
    const fn = createSpy((/**@type {number}*/ value) => value + 1);
    const [add, run] = chainof();

    add(fn);
    add(fn);
    const value = run(1);

    expect(value).toEqual(2);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
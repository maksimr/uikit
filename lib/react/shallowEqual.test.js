import { shallowEqual } from './shallowEqual';

describe('shallowEqual', function() {
  it('should correctly compare primitive values', function() {
    expect(shallowEqual(1, 1)).toEqual(true);
    expect(shallowEqual(0, 0)).toEqual(true);
    expect(shallowEqual(Infinity, Infinity)).toEqual(true);
    expect(shallowEqual(NaN, NaN)).toEqual(true);
    expect(shallowEqual('foo', 'foo')).toEqual(true);
    expect(shallowEqual('', '')).toEqual(true);
    expect(shallowEqual(true, true)).toEqual(true);
    expect(shallowEqual(false, false)).toEqual(true);
    expect(shallowEqual(null, null)).toEqual(true);
    expect(shallowEqual(undefined, undefined)).toEqual(true);
    expect(shallowEqual(1, 2)).toEqual(false);
    expect(shallowEqual(null, undefined)).toEqual(false);
  });

  it('should compare object values', function() {
    expect(shallowEqual({}, {})).toEqual(true);
    expect(shallowEqual([], [])).toEqual(true);
    expect(shallowEqual(['foo'], ['foo'])).toEqual(true);
    expect(shallowEqual({ foo: 'foo' }, {})).toEqual(false);
    expect(shallowEqual({ foo: 'foo' }, { bar: 'foo' })).toEqual(false);
    expect(shallowEqual({ foo: 'foo' }, { foo: 'bar' })).toEqual(false);
    expect(shallowEqual(['foo'], ['bar'])).toEqual(false);
  });
});
import { classNames } from "./classNames";

describe('classNames', function() {
  it('should accept string as a parameter', function() {
    expect(classNames('foo')).toEqual('foo');
  });

  it('should accept any number of strings', function() {
    expect(classNames('foo', 'bar', 'zoo')).toEqual('foo bar zoo');
  });

  it('should accept object as a parameter', function() {
    expect(classNames({ foo: true })).toEqual('foo');
  });

  it('should not add class if it has falsy value', function() {
    expect(classNames({ foo: false })).toEqual('');
    expect(classNames({ foo: 0 })).toEqual('');
    expect(classNames({ foo: null })).toEqual('');
  });

  it('should accept array', function() {
    expect(classNames(['foo'])).toEqual('foo');
  });

  it('should accept mixed parameters', function() {
    expect(classNames('foo', { bar: true }, ['zoo'])).toEqual('foo bar zoo');
  });
});
import { concatNames } from "./concatNames";

describe('concatNames', function() {
  it('should accept string as a parameter', function() {
    expect(concatNames('foo')).toEqual('foo');
  });

  it('should accept any number of strings', function() {
    expect(concatNames('foo', 'bar', 'zoo')).toEqual('foo bar zoo');
  });

  it('should accept object as a parameter', function() {
    expect(concatNames({ foo: true })).toEqual('foo');
  });

  it('should not add class if it has falsy value', function() {
    expect(concatNames({ foo: false })).toEqual('');
    expect(concatNames({ foo: 0 })).toEqual('');
    expect(concatNames({ foo: null })).toEqual('');
  });

  it('should accept array', function() {
    expect(concatNames(['foo'])).toEqual('foo');
  });

  it('should accept mixed parameters', function() {
    expect(concatNames('foo', { bar: true }, ['zoo'])).toEqual('foo bar zoo');
  });
});
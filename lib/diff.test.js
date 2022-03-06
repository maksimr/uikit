import { diff, diffValue, TEXT_DIFF_OPERATION } from './diff';

describe('diff', function() {
  it('should return diff for equal texts', function() {
    expect(diff('foo', 'foo'))
      .toEqual([diffValue(TEXT_DIFF_OPERATION.Equal, 'foo')]);
  });

  it('should return diff for deleted word', function() {
    expect(diff('foo', ''))
      .toEqual([diffValue(TEXT_DIFF_OPERATION.Delete, 'foo')]);
  });

  it('should return diff for inserted word', function() {
    expect(diff('', 'foo'))
      .toEqual([diffValue(TEXT_DIFF_OPERATION.Insert, 'foo')]);
  });

  it('should return diff with common prefix', function() {
    expect(diff('foobar', 'foo'))
      .toEqual([
        diffValue(TEXT_DIFF_OPERATION.Equal, 'foo'),
        diffValue(TEXT_DIFF_OPERATION.Delete, 'bar')
      ]);

    expect(diff('foo', 'foobar'))
      .toEqual([
        diffValue(TEXT_DIFF_OPERATION.Equal, 'foo'),
        diffValue(TEXT_DIFF_OPERATION.Insert, 'bar')
      ]);
  });

  it('should return diff with common suffix', function() {
    expect(diff('barfoo', 'foo'))
      .toEqual([
        diffValue(TEXT_DIFF_OPERATION.Delete, 'bar'),
        diffValue(TEXT_DIFF_OPERATION.Equal, 'foo')
      ]);

    expect(diff('foo', 'barfoo'))
      .toEqual([
        diffValue(TEXT_DIFF_OPERATION.Insert, 'bar'),
        diffValue(TEXT_DIFF_OPERATION.Equal, 'foo')
      ]);
  });

  it('should return diff if text is part of antoher one', function() {
    expect(diff('foo', 'barfoobar'))
      .toEqual([
        diffValue(TEXT_DIFF_OPERATION.Insert, 'bar'),
        diffValue(TEXT_DIFF_OPERATION.Equal, 'foo'),
        diffValue(TEXT_DIFF_OPERATION.Insert, 'bar'),
      ]);

    expect(diff('barfoobar', 'foo'))
      .toEqual([
        diffValue(TEXT_DIFF_OPERATION.Delete, 'bar'),
        diffValue(TEXT_DIFF_OPERATION.Equal, 'foo'),
        diffValue(TEXT_DIFF_OPERATION.Delete, 'bar'),
      ]);
  });

  it('should return diff for small text', function() {
    expect(diff('f', 'bar'))
      .toEqual([
        diffValue(TEXT_DIFF_OPERATION.Delete, 'f'),
        diffValue(TEXT_DIFF_OPERATION.Insert, 'bar')
      ]);
  });

  it('should return diff for simple text', function() {
    expect(diff('foo', 'bar'))
      .toEqual([
        diffValue(TEXT_DIFF_OPERATION.Delete, 'foo'),
        diffValue(TEXT_DIFF_OPERATION.Insert, 'bar')
      ]);
  });

  it('should return diff for word with common part', function() {
    const textDiff = diff('foo', 'bor');
    expect(textDiff)
      .toEqual([
        diffValue(TEXT_DIFF_OPERATION.Delete, 'fo'),
        diffValue(TEXT_DIFF_OPERATION.Insert, 'b'),
        diffValue(TEXT_DIFF_OPERATION.Equal, 'o'),
        diffValue(TEXT_DIFF_OPERATION.Insert, 'r'),
      ]);
  });
});
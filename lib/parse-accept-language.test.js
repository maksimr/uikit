import { parseAcceptLanguage } from './parse-accept-language';

describe('parseAcceptLanguage', function() {
  it('should return empty array if value is empty', function() {
    expect(parseAcceptLanguage('')).toEqual([]);
  });

  it('should return array with one element if value is one element', function() {
    expect(parseAcceptLanguage('en')).toEqual(['en']);
    expect(parseAcceptLanguage('en-US')).toEqual(['en-US']);
    expect(parseAcceptLanguage('de-DE-1996')).toEqual(['de-DE-1996']);
  });

  it('should return array with two elements if value is two elements', function() {
    expect(parseAcceptLanguage('en,ru')).toEqual(['en', 'ru']);
  });

  it('should return array with two elements if value is two elements with q', function() {
    expect(parseAcceptLanguage('en;q=1,ru;q=0.5')).toEqual(['en', 'ru']);
    expect(parseAcceptLanguage('ru;q=0.5,en;q=1')).toEqual(['en', 'ru']);
  });

  it('should work properly if passed invalid values', function() {
    expect(parseAcceptLanguage(',en')).toEqual(['en']);
    expect(parseAcceptLanguage('en,')).toEqual(['en']);
    expect(parseAcceptLanguage(';en')).toEqual([]);
    expect(parseAcceptLanguage('en;')).toEqual(['en']);
    expect(parseAcceptLanguage('en;q=foo,ru')).toEqual(['en', 'ru']);
    expect(parseAcceptLanguage('en;q=,ru')).toEqual(['en', 'ru']);
    expect(parseAcceptLanguage('en;qq=0.5,ru')).toEqual(['en', 'ru']);
    expect(parseAcceptLanguage('en;,ru')).toEqual(['en', 'ru']);
    expect(parseAcceptLanguage('en;;;;,,,ru')).toEqual(['en', 'ru']);
  });

  it('should discard duplicates', function() {
    expect(parseAcceptLanguage('en;q=1,en;q=0.5,ru')).toEqual(['en', 'ru']);
  });
});
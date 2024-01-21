import { ansicolor } from './ansicolor';

describe('ansicolor', function() {
  it('should apply the specified attribute to the string', function() {
    expect(ansicolor('Hello, world!', 'red'))
      .toEqual('\x1b[31mHello, world!\x1b[0m');
  });

  it('should apply multiple attributes to the string', function() {
    expect(ansicolor('Hello, world!', ['bold', 'underline', 'red']))
      .toEqual('\x1b[1;4;31mHello, world!\x1b[0m');
  });
});
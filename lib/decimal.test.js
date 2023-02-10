import { add, decimal, multiply, stringify, subtract } from './decimal';

describe('decimal', () => {
  it('should add two decimal numbers without loose precision', () => {
    [
      ['0.1', '0.2', '0.3'],
      ['0.2', '0.1', '0.3'],
      ['0.2', '0.01', '0.21'],
      ['0.01', '0.2', '0.21'],
      ['-0.2', '0.01', '-0.19'],
      ['0.01', '-0.2', '-0.19'],
      ['10.1', '0.9', '11'],
      ['10.1', '0.8', '10.9'],
      ['9007199254740992', '1', '9007199254740993'],
      ['9007199254740992.1', '0.1', '9007199254740992.2']
    ].forEach(([x, y, expected]) => {
      const dx = decimal(x);
      const dy = decimal(y);
      expect(stringify(add(dx, dy))).toEqual(expected);
    });
  });

  it('should subtract two decimal numbers without loose precision', () => {
    expect(stringify(subtract(decimal('0.1'), decimal('0.2')))).toEqual('-0.1');
  });

  it('should multiply two decimal without loose precision', () => {
    expect(stringify(multiply(decimal('0.1'), decimal('0.2')))).toEqual('0.02');
    expect(stringify(multiply(decimal('1.0'), decimal('0.2')))).toEqual('0.2');
    expect(stringify(multiply(decimal('10'), decimal('0.2')))).toEqual('2');
  });

  it('should support JavaScript number', () => {
    expect(stringify(add(decimal(0.2), decimal(0.1)))).toEqual('0.3');
  });
});
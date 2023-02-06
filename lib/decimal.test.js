import { add, decimal, stringify, subtract } from './decimal';

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
});
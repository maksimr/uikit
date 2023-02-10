import { BigDecimal } from './decimal';

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
      ['9007199254740992.2', '0.1', '9007199254740992.3']
    ].forEach(([x, y, expected]) => {
      expect(BigDecimal.from(x).add(y).toString()).toEqual(expected);
    });
  });

  it('should subtract two decimal numbers without loose precision', () => {
    expect(BigDecimal.from('0.1').subtract('0.2').toString()).toEqual('-0.1');
  });

  it('should multiply two decimal without loose precision', () => {
    expect(BigDecimal.from('0.1').multiply('0.2').toString()).toEqual('0.02');
    expect(BigDecimal.from('1.0').multiply('0.2').toString()).toEqual('0.2');
    expect(BigDecimal.from('10').multiply('0.2').toString()).toEqual('2');
  });

  it('should support JavaScript number', () => {
    expect(BigDecimal.from(0.1).add(0.2).toString()).toEqual('0.3');
  });
});
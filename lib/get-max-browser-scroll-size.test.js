import { any } from '../test/test-util';
import { getMaxBrowserScrollSize } from './get-max-browser-scroll-size';

describe('getMaxBrowserScrollSize', () => {
  it('should get max browser vertical scroll size', function() {
    const size = getMaxBrowserScrollSize();
    expect(size).toEqual(any(Number));
  });

  it('should get max browser horizontal scroll size', function() {
    const size = getMaxBrowserScrollSize(true);
    expect(size).toEqual(any(Number));
  });

  it('should get max browser scroll size', function() {
    const size = getMaxBrowserScrollSize();
    expect(size).toBeGreaterThan(0);
  });
});
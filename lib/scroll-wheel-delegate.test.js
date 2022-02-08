import { scrollWheelDelegate } from './scroll-wheel-delegate';

describe('scrollWheelDelegate', function() {
  it('should trigger update scroll on initialization', function() {
    const updateScrollTop = jest.fn();
    scrollWheelDelegate({
      scrollWidth: 300,
      width: 100,
      initPosition: 100,
      updateScrollTop
    });

    expect(updateScrollTop).toHaveBeenCalledWith(100, data(0, 100, 300));
  });

  it('should trigger on change handler if position has changed', function() {
    const ref = { scrollTop: 0 };
    const updateScrollTop = jest.fn((scrollTop) => {
      ref.scrollTop = scrollTop;
    });
    const onChange = jest.fn();
    const initPosition = 100;
    const scrollWheel = scrollWheelDelegate({
      scrollWidth: 300,
      width: 100,
      initPosition,
      onChange,
      updateScrollTop
    });

    scrollWheel(ref.scrollTop + 1);
    expect(onChange).toHaveBeenCalledWith({
      ...data(0, initPosition + 1, 300),
      previous: initPosition
    });
  });

  it('should trigger update scroll top when we reach threshold and update bounds', function() {
    const ref = { scrollTop: 0, data: null };
    const updateScrollTop = jest.fn((scrollTop, data) => {
      ref.scrollTop = scrollTop;
      ref.data = data;
    });
    const onChange = jest.fn();
    const initPosition = 100;
    const scrollWheel = scrollWheelDelegate({
      scrollWidth: 300,
      width: 100,
      initPosition,
      onChange,
      updateScrollTop
    });

    scrollWheel(0);
    expect(updateScrollTop).toHaveBeenCalledWith(100, data(-100, 0, 200));
  });

  function data(from = 0, current = 0, to = 0) {
    return {
      bounds: { from, to },
      current
    };
  }
});
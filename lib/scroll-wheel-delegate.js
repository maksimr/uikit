/**
 * @typedef ScrollWheelBounds
 * @property {number} from
 * @property {number} to
 * @typedef ScrollWheelData
 * @property {number} current
 * @property {ScrollWheelBounds} bounds
 * @typedef ScrollWheelParameters
 * @property {number} scrollWidth
 * @property {number} width
 * @property {(scrollTop: number, data: ScrollWheelData) => void} updateScrollTop
 * @property {number} [initPosition]
 * @property {number} [offset]
 * @property {(data: (ScrollWheelData & {previous: number})) => void} [onChange]
 * @param {ScrollWheelParameters} params
 * @returns {(scrollTop: number) => void}
 */
export function scrollWheelDelegate({
  scrollWidth,
  width,
  initPosition = 0,
  offset = scrollWidth * 0.1,
  updateScrollTop,
  onChange
}) {
  /**@type {ScrollWheelData}*/
  const ref = {
    bounds: { from: 0, to: 0 },
    current: initPosition
  };
  updateBounds();
  return (scrollTop) => {
    const bounds = ref.bounds;
    const prevCurrent = ref.current;
    ref.current = bounds.from + scrollTop;
    if (prevCurrent !== ref.current) {
      onChange?.({ ...ref, previous: prevCurrent });
    }

    if (scrollTop < offset || scrollWidth - (scrollTop + width) < offset) {
      updateBounds();
    }
  };

  function updateBounds() {
    ref.bounds = getBounds(ref.current);
    updateScrollTop(getScrollTopForCenter(), { ...ref });
  }

  /**
   * @returns {number}
   */
  function getScrollTopForCenter() {
    return (scrollWidth - width) / 2;
  }

  /**
   * @param {number} position 
   * @returns {{from: number, to: number}}
   */
  function getBounds(position) {
    const pivot = position + width / 2;
    const from = pivot - scrollWidth / 2;
    const to = pivot + scrollWidth / 2;
    return {
      from,
      to
    };
  }
}
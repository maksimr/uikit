import React, { useEffect, useRef } from 'react';
import { findScrollableAncestor } from '../find-scrollable-ancestor';

/**
 * @enum {number}
 */
const Position = {
  INSIDE: 1,
  ABOVE: 2,
  BELOW: 3,
  INVISIBLE: 4
};

/**
 * @typedef WaypointProps
 * @property {JSX.Element|null} [children] 
 * @property {() => void} [onEnter] 
 * @property {() => void} [onLeave]
 * @property {number} [topOffset] 
 * @property {number} [bottomOffset]
 * @property {boolean} [horizontal]
 * @param {WaypointProps} props
 * @returns {JSX.Element}
 */
export function Waypoint({ children, topOffset = 0, bottomOffset = 0, horizontal = false, onEnter, onLeave }) {
  /**
   * @type {import('react').MutableRefObject<HTMLElement|null>}
   */
  const refElement = useRef(null);

  useEffect(() => {
    const element = refElement.current;

    if (!element || !(onEnter || onLeave)) {
      return;
    }

    const getCurrentPosition = () => {
      const bounds = getBounds(element, scrollableAncestor, { topOffset, bottomOffset, horizontal });
      const currentPosition = getCurrentPositionByBounds(bounds);
      return currentPosition;
    };

    /**
     * @type {Position|null}
     */
    let _previousPosition = null;
    const onScrollOrResize = () => {
      const currentPosition = getCurrentPosition();
      const previousPosition = _previousPosition;
      _previousPosition = currentPosition;

      if (currentPosition === previousPosition) {
        return;
      }

      if (currentPosition === Position.INSIDE) {
        onEnter?.();
      } else if (previousPosition === Position.INSIDE) {
        onLeave?.();
      }
    };

    const scrollableAncestor = (/**@type {HTMLElement|null}*/(findScrollableAncestor(element))) ?? window;
    scrollableAncestor.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    return () => {
      scrollableAncestor.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [refElement, topOffset, bottomOffset, onEnter, onLeave]);

  if (!children) {
    return <span ref={refElement} style={{ fontSize: 0 }} />;
  }

  return React.cloneElement(children, {
    innerRef: refElement
  });
}

/**
 * @typedef {{waypointTop: number, waypointBottom: number, viewportTop: number, viewportBottom: number}} Bounds 
 * @param {HTMLElement} element 
 * @param {HTMLElement|Window} scrollableAncestor 
 * @param {{topOffset?: number, bottomOffset?: number, horizontal?: boolean}} [params]
 * @returns {Bounds}
 */
function getBounds(element, scrollableAncestor, { topOffset = 0, bottomOffset = 0, horizontal = false }) {
  const rect = element.getBoundingClientRect();
  const waypointTop = horizontal ? rect.left : rect.top;
  const waypointBottom = horizontal ? rect.right : rect.bottom;

  let contextHeight = 0;
  let contextTop = 0;
  if (scrollableAncestor === window) {
    contextHeight = horizontal ? window.innerWidth : window.innerHeight;
    contextTop = 0;
  } else {
    const ancestorElement = (/**@type {HTMLElement}*/(scrollableAncestor));
    const contextRect = ancestorElement.getBoundingClientRect();
    contextHeight = horizontal ? ancestorElement.offsetWidth : ancestorElement.offsetHeight;
    contextTop = horizontal ? contextRect.left : contextRect.top;
  }

  const viewportTop = contextTop + topOffset;
  const viewportBottom = (contextTop + contextHeight) - bottomOffset;
  return {
    waypointTop,
    waypointBottom,
    viewportTop,
    viewportBottom
  };
}

/**
 * @param {Bounds} bounds 
 * @returns {Position}
 */
function getCurrentPositionByBounds(bounds) {
  if (bounds.viewportBottom - bounds.viewportTop === 0) {
    return Position.INVISIBLE;
  }

  if (
    bounds.viewportTop <= bounds.waypointTop &&
    bounds.waypointTop <= bounds.viewportBottom) {
    return Position.INSIDE;
  }

  if (
    bounds.viewportTop <= bounds.waypointBottom &&
    bounds.waypointBottom <= bounds.viewportBottom) {
    return Position.INSIDE;
  }

  if (
    bounds.waypointTop <= bounds.viewportTop &&
    bounds.viewportBottom <= bounds.waypointBottom) {
    return Position.INSIDE;
  }

  if (bounds.viewportBottom < bounds.waypointTop) {
    return Position.BELOW;
  }

  if (bounds.waypointTop < bounds.viewportTop) {
    return Position.ABOVE;
  }

  return Position.INVISIBLE;
}
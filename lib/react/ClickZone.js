import React, { cloneElement, useCallback, useRef, useEffect, isValidElement } from "react";

/**
 * @typedef ClickZoneProps
 * @property {function} [onClickAway]
 * @property {JSX.Element|string|null} children
 */

/**
 * @param {ClickZoneProps} props
 * @returns {JSX.Element|null}
 */
export function ClickZone({ onClickAway, children }) {
  const eventRef = useRef(null);
  const childOnClick = isValidElement(children) ? children?.props?.onClick : null;
  const onClick = useCallback((event) => {
    eventRef.current = event.nativeEvent;
    return childOnClick?.(event);
  }, [eventRef, childOnClick]);

  useEffect(() => {
    if (!onClickAway) {
      return;
    }
    const onClick = (/**@type {Event}*/event) => {
      if (event !== eventRef.current) {
        onClickAway(event);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [onClickAway]);

  return isValidElement(children) ? cloneElement(children, {
    onClick: onClick
  }) : (children ? <span onClick={onClick}>{children}</span> : null);
}
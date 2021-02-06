import { cloneElement, useCallback, useRef, useEffect } from "react";

/**
 * @typedef ClickZoneProps
 * @property {function} [onClickAway]
 * @property {JSX.Element|null} children
 */

/**
 * @param {ClickZoneProps} props
 * @returns {JSX.Element|null}
 */
export function ClickZone({ onClickAway, children }) {
  const eventRef = useRef(null);
  const onClick = useCallback((event) => {
    eventRef.current = event.nativeEvent;
    return children?.props?.onClick?.(event);
  }, [eventRef, children?.props?.onClick]);

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

  return children ? cloneElement(children, {
    onClick: onClick
  }) : null;
}
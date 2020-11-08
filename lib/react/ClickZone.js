import { cloneElement, useCallback, useRef, useEffect } from "react";

/**
 * @typedef ClickZoneProps
 * @property {function} [onClickAway]
 * @property {JSX.Element} [children]
 */

/**
 * @param {ClickZoneProps} props
 * @returns {JSX.Element}
 */
export function ClickZone({ onClickAway, children }) {
  const ref = useRef(null);
  const onClick = useCallback((event) => {
    ref.current = event.nativeEvent;
  }, [ref]);

  useEffect(() => {
    if (!onClickAway) {
      return;
    }
    const onClick = (event) => {
      if (event !== ref.current) {
        onClickAway(event);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [onClickAway]);

  return cloneElement(children, {
    onClick: onClick
  });
}
import React, { cloneElement, useCallback, useRef, useEffect, isValidElement } from "react";

/**
 * @typedef ClickZoneProps
 * @property {function} [onClickAway]
 * @property {React.ReactNode} children
 */

/**
 * @param {ClickZoneProps} props
 * @returns {JSX.Element|null}
 */
export function ClickZone({ onClickAway, children }) {
  const ref = useRef(/**@type {Event|null|undefined}*/(null));
  const childOnClick = isValidElement(children) ? children?.props?.onClick : null;
  const onClick = useCallback((event) => {
    ref.current = event.nativeEvent;
    return childOnClick?.(event);
  }, [ref, childOnClick]);

  useEffect(() => {
    if (!onClickAway) {
      return;
    }
    // Workaround for problem with Portal element
    // If our child is a portal than `click` on the document would be
    // registered and handle event by which we can render our component
    // so this leads to call onClickAway handler
    ref.current = window.event;
    const onClick = (/**@type {Event}*/event) => {
      if (event !== ref.current) {
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
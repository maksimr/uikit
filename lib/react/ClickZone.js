import React, { cloneElement, useCallback, useRef, useEffect, isValidElement } from 'react';
import { addEventListener } from '../consolidated-events';

/**
 * @typedef ClickZoneProps
 * @property {function} [onClickAway] Callback to handle click away click zone
 * @property {React.ReactNode} children
 */

/**
 * @description Allow to handle click outside the click zone component.
 * If component wrap only one child, it would not create an additional wrapper, but if children are an array or not valid
 * React component, like string, it would create wrapper component and proxy all passed props to it
 * @param {ClickZoneProps & React.HTMLAttributes<HTMLElement>} props
 * @returns {JSX.Element|null}
 */
export function ClickZone({ onClickAway, children, ...restProps }) {
  const eventRef = useRef(/**@type {Event|null|undefined}*/(null));
  const childOnClick = isValidElement(children) ? children?.props?.onClick : (restProps.onClick ?? null);
  const onClick = useCallback((/**@type {React.MouseEvent}*/event) => {
    eventRef.current = event.nativeEvent;
    return childOnClick?.(event);
  }, [eventRef, childOnClick]);

  useEffect(() => {
    if (!onClickAway) {
      return;
    }
    // Workaround for the problem with Portal element
    // If our child is a portal than "click" on the document would be
    // registered and handle event by which we can render our component
    // so this leads to calling onClickAway handler
    eventRef.current = window.event;
    return addEventListener(document, 'click', (event) => {
      if (event !== eventRef.current) {
        onClickAway(event);
      }
    });
  }, [onClickAway]);

  return isValidElement(children) ? cloneElement(children, {
    onClick: onClick
  }) : (children ? <span {...restProps} onClick={onClick}>{children}</span> : null);
}
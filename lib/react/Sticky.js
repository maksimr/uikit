import React, { useEffect, useMemo, useRef } from 'react';
import { findScrollableElement } from '../find-scrollable-element';
import { throttle } from "../throttle";

/**
 * @typedef {import('react').CSSProperties} CSSProperties
 * @typedef StickyBaseProps
 * @property {function} [onSticky]
 * @property {CSSProperties} [style]
 * @property {number} [throttleDuration]
 * @property {React.ReactNode} [children]
 * @typedef {StickyBaseProps & React.HTMLProps<HTMLDivElement>} StickyProps
 */

/**
 * @param {StickyProps} props
 * @returns {JSX.Element}
 */
export function Sticky({ children, onSticky, style, throttleDuration = 40, ...restProps }) {
  const elementRef = useRef(/**@type {HTMLDivElement|null}*/(null));
  const css = useMemo(() => (/**@type {CSSProperties}*/({ position: 'sticky', top: 0, ...style })), [style]);
  useEffect(() => {
    const currentNode = elementRef.current;
    if (!currentNode) {
      return;
    }
    const scrollableNode = findScrollableElement(currentNode) || window;
    const onScroll = () => {
      const stuck = isStuck(currentNode);
      onSticky && onSticky(stuck, currentNode);
      return stuck
        ? currentNode.classList.add('-sticky')
        : currentNode.classList.remove('-sticky');
    };
    onScroll();
    return addEventListener(
      scrollableNode,
      'scroll',
      throttle(onScroll, throttleDuration),
      { passive: true }
    );
  }, [elementRef.current, throttleDuration, onSticky]);

  return (
    <div {...restProps} style={css} ref={elementRef}>
      {children}
    </div>
  );
}

/**
 * @param {HTMLElement} node
 * @returns {boolean}
 */
function isStuck(node) {
  const box = node.getBoundingClientRect();
  return (node.nextSibling
      ? box.bottom > (/**@type {HTMLElement}*/(node.nextSibling)).getBoundingClientRect().top
      : box.bottom > (/**@type {HTMLElement}*/(node.parentNode)).getBoundingClientRect().bottom) ||
    (node.previousSibling
      ? box.top < (/**@type {HTMLElement}*/(node.previousSibling)).getBoundingClientRect().bottom
      : box.top < (/**@type {HTMLElement}*/(node.parentNode)).getBoundingClientRect().top);
}

/**
 * @param {Element|Window} node
 * @param {string} eventName
 * @param {EventListener|EventListenerObject} callback
 * @param {boolean|AddEventListenerOptions} [options]
 * @returns {function(): void}
 */
function addEventListener(node, eventName, callback, options) {
  node.addEventListener(eventName, callback, options);
  return () => node.removeEventListener(eventName, callback, options);
}

import { useMemo } from 'react';

const { useRef, useEffect } = require('react');
const React = require('react');
import { findScrollableElement } from '../find-scrollable-element';

/**
 * @typedef {import('react').CSSProperties} CSSProperties
 * @typedef StickyProps
 * @property {function} [onSticky]
 * @property {CSSProperties} [style]
 * @property {number} [throttleDuration]
 * @property {JSX.Element|string} [children]
 * @typedef {StickyProps & React.HTMLAttributes<HTMLElement>} PopupProps
 */

// noinspection JSCommentMatchesSignature
/**
 * @param {StickyProps} props
 * @returns {JSX.Element}
 */
export function Sticky({ children, onSticky, style, throttleDuration = 40, ...props }) {
  const elementRef = useRef(/**@type {HTMLDivElement|null}*/(null));
  /**
   * @type {CSSProperties}
   */
  const css = useMemo(() => ({ position: 'sticky', top: 0, ...style }), [style]);
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
      throttle(onScroll, throttleDuration)
    );
  }, [elementRef.current, throttleDuration, onSticky]);

  return (
    <div {...props} style={css} ref={elementRef}>
      {children}
    </div>
  );
}

/**
 * @param {any} node
 * @returns {boolean}
 */
function isStuck(node) {
  const box = node.getBoundingClientRect();
  return (node.nextSibling
    ? box.bottom > node.nextSibling.getBoundingClientRect().top
    : box.bottom > node.parentNode.getBoundingClientRect().bottom) ||
    (node.prevSibling
      ? box.top < node.prevSibling.getBoundingClientRect().bottom
      : box.top < node.parentNode.getBoundingClientRect().top);
}

/**
 * @param {function} fn
 * @param {number} ms
 * @returns {function}
 */
function throttle(fn, ms) {
  let timerId = null;
  let lastArgs = null;
  return (...args) => {
    lastArgs = args;
    if (!timerId) {
      timerId = setTimeout(callback, ms);
    }
  };

  function callback() {
    timerId = null;
    fn(lastArgs);
  }
}

function addEventListener(node, eventName, callback) {
  node.addEventListener(eventName, callback);
  return () => node.removeEventListener(eventName, callback);
}

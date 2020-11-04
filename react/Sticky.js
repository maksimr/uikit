var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
export function Sticky(_a) {
    var { children, onSticky, style, throttleDuration = 40 } = _a, props = __rest(_a, ["children", "onSticky", "style", "throttleDuration"]);
    const elementRef = useRef();
    /**
     * @type {CSSProperties}
     */
    const css = useMemo(() => (Object.assign({ position: 'sticky', top: 0 }, style)), [style]);
    useEffect(() => {
        /**
         * @type {HTMLElement|null}
         */
        const currentNode = elementRef.current;
        if (!currentNode) {
            return;
        }
        const scrollableNode = findScrollableElement(currentNode) || window;
        onScroll();
        return addEventListener(scrollableNode, 'scroll', throttle(onScroll, throttleDuration));
        function onScroll() {
            const stuck = isStuck(currentNode);
            onSticky && onSticky(stuck, currentNode);
            return stuck
                ? currentNode.classList.add('-sticky')
                : currentNode.classList.remove('-sticky');
        }
    }, [elementRef.current, throttleDuration, onSticky]);
    return (React.createElement("div", Object.assign({}, props, { style: css, ref: elementRef }), children));
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

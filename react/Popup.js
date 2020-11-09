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
import { createPortal } from 'react-dom';
import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { addResizeListener } from '../resize-observer';
import { findScrollableElement } from '../find-scrollable-element';
const PopupContext = createContext(null);
const Direction = {
    Bottom: 1,
    Left: 2,
    Top: 4,
    Right: 8,
    Center: 256
};
/**
 * @enum {number}
 */
export const PopupDirection = {
    BOTTOM_LEFT: Direction.Bottom | auxiliary(Direction.Left),
    BOTTOM_RIGHT: Direction.Bottom | auxiliary(Direction.Right),
    BOTTOM_CENTER: Direction.Bottom | Direction.Center,
    TOP_LEFT: Direction.Top | auxiliary(Direction.Left),
    TOP_RIGHT: Direction.Top | auxiliary(Direction.Right),
    TOP_CENTER: Direction.Top | Direction.Center,
    LEFT_TOP: Direction.Left | auxiliary(Direction.Top),
    LEFT_BOTTOM: Direction.Left | auxiliary(Direction.Bottom),
    LEFT_CENTER: Direction.Left | Direction.Center,
    RIGHT_TOP: Direction.Right | auxiliary(Direction.Top),
    RIGHT_BOTTOM: Direction.Right | auxiliary(Direction.Bottom),
    RIGHT_CENTER: Direction.Right | Direction.Center
};
const directions = [
    PopupDirection.BOTTOM_LEFT,
    PopupDirection.BOTTOM_RIGHT,
    PopupDirection.TOP_LEFT,
    PopupDirection.TOP_RIGHT,
    PopupDirection.LEFT_BOTTOM,
    PopupDirection.LEFT_TOP,
    PopupDirection.RIGHT_BOTTOM,
    PopupDirection.RIGHT_TOP,
    PopupDirection.BOTTOM_CENTER,
    PopupDirection.TOP_CENTER,
    PopupDirection.LEFT_CENTER,
    PopupDirection.RIGHT_CENTER
];
/**
 * @typedef {import('react').CSSProperties} CSSProperties
 * @typedef PopupBaseProps
 * @property {Array<PopupDirection> | PopupDirection} [direction]
 * @property {HTMLElement} [anchorNode]
 * @property {HTMLElement} [parentNode]
 * @property {boolean} [resizable]
 * @property {CSSProperties} [style]
 * @property {JSX.Element} [children]
 * @typedef {PopupBaseProps & React.HTMLAttributes<HTMLElement>} PopupProps
 */
/**
 * @param {PopupProps} props
 * @returns {React.ReactPortal|JSX.Element}
 */
export function Popup(props) {
    const [autoAnchor, setAutoAnchor] = useState(null);
    const autoAnchorDetector = useRef(null);
    useEffect(() => {
        if (props.anchorNode || autoAnchor) {
            return;
        }
        if (autoAnchorDetector.current) {
            setAutoAnchor(autoAnchorDetector.current.parentNode);
        }
    }, [autoAnchorDetector.current, setAutoAnchor, props.anchorNode]);
    return props.anchorNode || autoAnchor ?
        React.createElement(PopupPortal, Object.assign({ anchorNode: autoAnchor }, props)) :
        React.createElement("span", { ref: autoAnchorDetector });
}
/**
 * @param {PopupProps} props
 * @returns {React.ReactPortal}
 */
export function PopupPortal(_a) {
    var { direction = directions, anchorNode, parentNode, resizable = false, style, children } = _a, restProps = __rest(_a, ["direction", "anchorNode", "parentNode", "resizable", "style", "children"]);
    const popupConfig = useContext(PopupContext);
    const [popupNode, setPopupNode] = useState(null);
    /**
     * @type {HTMLElement}
     */
    const positionedNode = useMemo(() => parentNode || (popupConfig === null || popupConfig === void 0 ? void 0 : popupConfig.parentNode) || findPositionedElement(anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.parentNode) || document.body, [anchorNode, parentNode, popupConfig === null || popupConfig === void 0 ? void 0 : popupConfig.parentNode]);
    /**
     * @type [CSSProperties, any]
     */
    const [positionStyle, setPositionStyle] = useState({
        position: 'absolute',
        visible: 'hidden'
    });
    useEffect(() => {
        if (!popupNode || !anchorNode) {
            return;
        }
        onResize();
        window.addEventListener('resize', onResize);
        const removePopupResizeListener = resizable
            ? addResizeListener(popupNode, onResize)
            : null;
        return () => {
            resizable && removePopupResizeListener();
            window.removeEventListener('resize', onResize);
        };
        function onResize() {
            setPositionStyle(calcStyle(direction, anchorNode, popupNode, positionedNode));
        }
    }, [anchorNode, positionedNode, popupNode, direction, setPositionStyle, resizable]);
    if (!anchorNode || !positionedNode) {
        return null;
    }
    const popupStyle = style ? Object.assign({ positionStyle }, style) : positionStyle;
    return createPortal(React.createElement("div", Object.assign({ "data-role": 'popup', ref: setPopupNode, style: popupStyle }, restProps), children), positionedNode);
}
/**
 * @typedef PopupProviderProps
 * @property {{parentNode: HTMLElement}} value
 * @property {JSX.Element} [children]
 */
/**
 * @param {PopupProviderProps} props
 * @returns {JSX.Element}
 */
export function PopupProvider({ value, children }) {
    return React.createElement(PopupContext.Provider, { value: value }, children);
}
/**
 * @param {Array<PopupDirection>|PopupDirection} direction
 * @param {HTMLElement} anchorNode
 * @param {HTMLElement} popupNode
 * @param {HTMLElement} parentNode
 * @returns {CSSProperties}
 */
function calcStyle(direction, anchorNode, popupNode, parentNode) {
    if (!popupNode) {
        return { position: 'absolute' };
    }
    const anchorRect = anchorNode.getBoundingClientRect();
    const parentRect = parentNode.getBoundingClientRect();
    const popupRect = popupNode.getBoundingClientRect();
    const pos = Array.isArray(direction)
        ? calcPositionForBestDirection(direction, anchorRect, popupRect, parentNode)
        : calcPosition(direction, anchorRect, popupRect);
    pos.top = pos.top - parentRect.top;
    pos.left = pos.left - parentRect.left;
    return Object.assign({ position: 'absolute' }, pos);
}
/**
 * @param {Array<PopupDirection>} directions
 * @param {DOMRect} anchorRect
 * @param {DOMRect} popupRect
 * @param {HTMLElement} parentNode
 * @returns {{top: number, left: number}|null}
 */
function calcPositionForBestDirection(directions, anchorRect, popupRect, parentNode) {
    const scrollableNode = findScrollableElement(parentNode) || document.documentElement;
    let scrollableRect = scrollableNode.getBoundingClientRect();
    // getBoundingClientRect returns incorrect values for height and bottom of
    // html element
    if (scrollableNode === document.documentElement) {
        /**
         * @type {DOMRect}
         */
        scrollableRect = {
            x: scrollableRect.left,
            left: scrollableRect.left,
            right: scrollableRect.right,
            width: scrollableRect.width,
            height: scrollableNode.clientHeight,
            y: scrollableNode.clientHeight,
            top: scrollableRect.top,
            bottom: scrollableNode.clientHeight - scrollableNode.scrollTop,
            toJSON() {
            }
        };
    }
    let pos = null;
    for (let i = 0; i < directions.length; i++) {
        const dirPos = calcPosition(directions[i], anchorRect, popupRect);
        pos = pos || dirPos;
        if (dirPos.top > scrollableRect.top &&
            dirPos.top + popupRect.height < scrollableRect.bottom &&
            dirPos.left > scrollableRect.left &&
            dirPos.left + popupRect.width < scrollableRect.right) {
            return dirPos;
        }
    }
    return pos;
}
/**
 * @param {PopupDirection} direction
 * @param {DOMRect} anchorRect
 * @param {DOMRect} popupRect
 * @returns {{top: number, left: number}}
 */
function calcPosition(direction, anchorRect, popupRect) {
    let top;
    let left;
    switch (true) {
        case checkDirection(direction, Direction.Bottom):
            top = anchorRect.top + anchorRect.height;
            break;
        case checkDirection(direction, Direction.Top):
            top = anchorRect.top - popupRect.height;
            break;
        case checkDirection(direction, Direction.Left):
            left = anchorRect.left - popupRect.width;
            break;
        case checkDirection(direction, Direction.Right):
            left = anchorRect.left + anchorRect.width;
            break;
        default:
            throw Error(`Invalid main direction value (${direction})`);
    }
    switch (true) {
        case checkDirection(direction, auxiliary(Direction.Right)):
            left = anchorRect.left + anchorRect.width - popupRect.width;
            break;
        case checkDirection(direction, auxiliary(Direction.Left)):
            left = anchorRect.left;
            break;
        case checkDirection(direction, auxiliary(Direction.Bottom)):
            top = anchorRect.top + anchorRect.height - popupRect.height;
            break;
        case checkDirection(direction, auxiliary(Direction.Top)):
            top = anchorRect.top;
            break;
        case checkDirection(direction, Direction.Center):
            if (checkDirection(direction, Direction.Top, Direction.Bottom)) {
                left = anchorRect.left + anchorRect.width / 2 - popupRect.width / 2;
                break;
            }
            else if (checkDirection(direction, Direction.Left, Direction.Right)) {
                top = anchorRect.top + anchorRect.height / 2 - popupRect.height / 2;
                break;
            }
            break;
        default:
            throw Error(`Invalid auxiliary direction ${direction}`);
    }
    return { top, left };
    function checkDirection(direction, ...directions) {
        return directions.some((it) => it & direction);
    }
}
/**
 * @param {number} d
 * @returns {number}
 */
function auxiliary(d) {
    return d << 4;
}
/**
 * @param {any} element
 * @return {HTMLElement|null}
 */
export function findPositionedElement(element) {
    while (element) {
        if (element.nodeType !== 1) {
            return null;
        }
        const position = window.getComputedStyle(element).position;
        if (position === 'static') {
            /**
             * @type {Element}
             */
            // @ts-ignore
            element = element.parentNode;
            continue;
        }
        break;
    }
    return element;
}

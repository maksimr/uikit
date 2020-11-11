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
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { addResizeListener } from '../resize-observer';
import { calculateTargetPositionRelativeToAnchor, Direction } from "../node-position";
const PopupContext = createContext(null);
/**
 * @enum {string}
 */
export const PopupDirection = Direction;
/**
 * @typedef {import('react').CSSProperties} CSSProperties
 * @typedef PopupBaseProps
 * @property {PopupDirection} [direction]
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
    var { direction, anchorNode, parentNode, resizable = false, style, children } = _a, restProps = __rest(_a, ["direction", "anchorNode", "parentNode", "resizable", "style", "children"]);
    const popupConfig = useContext(PopupContext);
    const [popupNode, setPopupNode] = useState(null);
    /**
     * @type {HTMLElement}
     */
    const positionedNode = useMemo(() => parentNode || (popupConfig === null || popupConfig === void 0 ? void 0 : popupConfig.parentNode) || (anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.offsetParent) || document.body, [anchorNode, parentNode, popupConfig === null || popupConfig === void 0 ? void 0 : popupConfig.parentNode]);
    /**
     * @type [CSSProperties, any]
     */
    const [positionStyle, setPositionStyle] = useState({
        position: 'absolute',
        visibility: 'hidden'
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
 * @param {string} direction
 * @param {HTMLElement} anchorNode
 * @param {HTMLElement} popupNode
 * @param {HTMLElement} parentNode
 * @returns {CSSProperties}
 */
function calcStyle(direction, anchorNode, popupNode, parentNode) {
    return !popupNode ?
        { position: 'absolute' } : Object.assign({ position: 'absolute' }, (calculateTargetPositionRelativeToAnchor(popupNode, anchorNode, parentNode, direction)));
}

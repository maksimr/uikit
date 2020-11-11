import { createPortal } from 'react-dom';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { addResizeListener } from '../resize-observer';
import { calcNodePosition, Direction } from "../calc-node-position";

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
    <PopupPortal anchorNode={autoAnchor} {...props} /> :
    <span ref={autoAnchorDetector}/>;
}

/**
 * @param {PopupProps} props
 * @returns {React.ReactPortal}
 */
export function PopupPortal({
                              direction,
                              anchorNode,
                              parentNode,
                              resizable = false,
                              style,
                              children,
                              ...restProps
                            }) {
  const popupConfig = useContext(PopupContext);
  const [popupNode, setPopupNode] = useState(null);
  /**
   * @type {HTMLElement}
   */
  const positionedNode = useMemo(() => parentNode || popupConfig?.parentNode || anchorNode?.offsetParent || document.body, [anchorNode, parentNode, popupConfig?.parentNode]);
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

  const popupStyle = style ? { positionStyle, ...style } : positionStyle;
  return createPortal(
    <div data-role='popup' ref={setPopupNode} style={popupStyle} {...restProps}>
      {children}
    </div>,
    positionedNode
  );
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
  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
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
    { position: 'absolute' } :
    {
      position: 'absolute',
      ...(calcNodePosition(popupNode, anchorNode, parentNode, direction))
    };
}
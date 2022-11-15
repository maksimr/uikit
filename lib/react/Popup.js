import { createPortal } from 'react-dom';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { calculateTargetPositionRelativeToAnchor, Direction } from '../node-position';

/**
 * @typedef PopupOptions
 * @property {HTMLElement} [parentNode]
 */
const PopupContext = createContext(/**@type {PopupOptions|null}*/(null));

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
 * @property {React.ReactNode} [children]
 * @typedef {PopupBaseProps & React.HTMLAttributes<HTMLElement>} PopupProps
 */

/**
 * @param {PopupProps} props
 * @returns {React.ReactPortal|JSX.Element}
 */
export function Popup(props) {
  const [autoAnchor, setAutoAnchor] = useState((/**@type {HTMLElement|null}*/(null)));
  const autoAnchorDetector = (/**@type {React.MutableRefObject<HTMLElement|null>}*/(useRef()));
  useEffect(() => {
    if (props.anchorNode || autoAnchor) {
      return;
    }
    if (autoAnchorDetector.current) {
      setAutoAnchor(/**@type {HTMLElement}*/(autoAnchorDetector.current.parentNode));
    }
  }, [autoAnchorDetector.current, setAutoAnchor, props.anchorNode]);

  const anchorNode = props.anchorNode || autoAnchor;
  return anchorNode ?
    <PopupPortal anchorNode={anchorNode} {...props} /> :
    <span ref={autoAnchorDetector} />;
}

/**
 * @param {PopupProps} props
 * @returns {React.ReactPortal|null}
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
  const [popupNode, setPopupNode] = useState(/**@type {HTMLElement|null}*/(null));
  const positionedNode = /**@type {HTMLElement}*/ (useMemo(() => parentNode || popupConfig?.parentNode || anchorNode?.offsetParent || document.body, [anchorNode, parentNode, popupConfig?.parentNode]));
  const [positionStyle, setPositionStyle] = useState(/**@type {CSSProperties}*/({
    position: 'absolute',
    visibility: 'hidden'
  }));
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
      removePopupResizeListener && removePopupResizeListener();
      window.removeEventListener('resize', onResize);
    };

    /**
     * @param {HTMLElement} popupNode
     * @param {VoidFunction} fn
     * @returns
     */
    function addResizeListener(popupNode, fn) {
      /**@type {number|null}*/
      let timerId = null;
      const resizeObserver = new ResizeObserver(() => {
        timerId = timerId || requestAnimationFrame(() => {
          timerId = null;
          fn();
        });
      });
      resizeObserver.observe(popupNode);
      return () => {
        timerId && cancelAnimationFrame(timerId);
        timerId = null;
        resizeObserver.unobserve(popupNode);
      };
    }

    function onResize() {
      setPositionStyle(calcStyle(direction, /**@type {HTMLElement}*/(anchorNode), /**@type {HTMLElement}*/(popupNode), positionedNode));
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
 * @property {PopupOptions} value
 * @property {React.ReactNode} [children]
 */
/**
 * @param {PopupProviderProps} props
 * @returns {JSX.Element}
 */
export function PopupProvider({ value, children }) {
  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
}

/**
 * @param {string|undefined} direction
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
      ...(calculateTargetPositionRelativeToAnchor(popupNode, anchorNode, parentNode, direction))
    };
}
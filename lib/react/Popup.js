import { createPortal } from 'react-dom';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { addResizeListener } from '../resize-observer';
import { findScrollableElement } from '../find-scrollable-element';

const PopupContext = createContext(null);

/**
 * @enum {string}
 */
export const PopupDirection = {
  BOTTOM_LEFT: 'bl',
  BOTTOM_RIGHT: 'br',
  TOP_LEFT: 'tl',
  TOP_RIGHT: 'tr',
  LEFT_TOP: 'lt',
  LEFT_BOTTOM: 'lb',
  RIGHT_TOP: 'rt',
  RIGHT_BOTTOM: 'rb'
};

const defaultDirection = [
  PopupDirection.BOTTOM_LEFT,
  PopupDirection.BOTTOM_RIGHT,
  PopupDirection.TOP_LEFT,
  PopupDirection.TOP_RIGHT,
  PopupDirection.LEFT_BOTTOM,
  PopupDirection.LEFT_TOP,
  PopupDirection.RIGHT_BOTTOM,
  PopupDirection.RIGHT_TOP
].join('/');

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
      ...(positionNode(popupNode, anchorNode, parentNode, direction))
    };
}

/**
 * @param {HTMLElement} targetNode
 * @param {HTMLElement} anchorNode
 * @param {Element} [positionedParentNode]
 * @param {string} [direction]
 * @returns {{top: number, left: number}}
 */
function positionNode(
  targetNode,
  anchorNode,
  positionedParentNode = anchorNode.offsetParent,
  direction = defaultDirection
) {
  const anchorRect = anchorNode.getBoundingClientRect();
  const targetRect = targetNode.getBoundingClientRect();
  const parentRect = positionedParentNode.getBoundingClientRect();
  const relLeft = anchorRect.x - parentRect.x;
  const relTop = anchorRect.y - parentRect.y;
  const Direction = {
    TOP: 't',
    BOTTOM: 'b',
    LEFT: 'l',
    RIGHT: 'r'
  };

  const directions = direction.split('/');
  let targetPosition = null;

  for (let i = 0; i < directions.length; i++) {
    const dir = directions[i];
    const dirPosition = { top: 0, left: 0 };
    const [
      main = Direction.BOTTOM,
      auxiliary = main === Direction.TOP || main === Direction.BOTTOM
        ? Direction.LEFT
        : Direction.BOTTOM
    ] = dir.toLowerCase().split('');
    switch (main) {
      case Direction.TOP:
        dirPosition.top = relTop - targetRect.height;
        break;
      case Direction.BOTTOM:
        dirPosition.top = relTop + anchorRect.height;
        break;
      case Direction.LEFT:
        dirPosition.left = relLeft - targetRect.width;
        break;
      case Direction.RIGHT:
        dirPosition.left = relLeft + anchorRect.width;
        break;
      default:
        throw Error(`Invalid main direction "${main}"`);
    }

    switch (auxiliary) {
      case Direction.LEFT:
        dirPosition.left = relLeft;
        break;
      case Direction.RIGHT:
        dirPosition.left = relLeft + anchorRect.width - targetRect.width;
        break;
      case Direction.TOP:
        dirPosition.top = relTop;
        break;
      case Direction.BOTTOM:
        dirPosition.top = relTop + anchorRect.height - targetRect.height;
        break;
      default:
        throw Error(`Invalid auxiliary direction "${auxiliary}"`);
    }

    const scrolledNode = findScrollableElement(positionedParentNode) || document.body;
    const scrollRect = scrolledNode.getBoundingClientRect();
    const height = scrolledNode.scrollHeight || scrollRect.height;
    const width = scrolledNode.scrollWidth || scrollRect.width;
    const dx = parentRect.x - scrollRect.x;
    const dy = parentRect.y - scrollRect.y;

    if (
      dirPosition.top + dy < 0 ||
      dirPosition.top + dy + targetRect.height > height ||
      dirPosition.left + dx < 0 ||
      dirPosition.left + dx + targetRect.width > width
    ) {
      targetPosition = targetPosition || dirPosition;
      continue;
    }

    targetPosition = dirPosition;
    break;
  }

  return targetPosition;
}

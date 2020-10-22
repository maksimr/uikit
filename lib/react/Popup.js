import { createPortal } from 'react-dom';
import React, { useEffect, useState } from 'react';
import { addResizeListener } from '../resize-observer';
import { findScrollableElement } from '../find-scrollable-element';

const Direction = {
  Bottom: 1,
  Left: 2,
  Top: 4,
  Right: 8,
  Center: 256
};

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

export function Popup({
                        direction = directions,
                        anchorNode,
                        parentNode = anchorNode?.parentNode,
                        resizable = false,
                        children
                      }) {
  const [popupNode, setPopupNode] = useState(null);
  const [style, setStyle] = useState({
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
      setStyle(calcStyle(direction, anchorNode, popupNode, parentNode));
    }
  }, [anchorNode, parentNode, popupNode, direction, setStyle, resizable]);

  return createPortal(
    <div ref={setPopupNode} style={style}>
      {children}
    </div>,
    parentNode
  );
}

function calcStyle(direction, anchorNode, popupNode, parentNode) {
  if (!popupNode) {
    return {position: 'absolute'};
  }

  const anchorRect = anchorNode.getBoundingClientRect();
  const parentRect = parentNode.getBoundingClientRect();
  const popupRect = popupNode.getBoundingClientRect();
  const pos = Array.isArray(direction)
    ? calcPositionForBestDirection(direction, anchorRect, popupRect, parentNode)
    : calcPosition(direction, anchorRect, popupRect);

  pos.top = pos.top - parentRect.top;
  pos.left = pos.left - parentRect.left;

  return {
    position: 'absolute',
    ...pos
  };
}

function calcPositionForBestDirection(
  directions,
  anchorRect,
  popupRect,
  parentNode
) {
  const scrollableNode = findScrollableElement(parentNode);
  let scrollableRect = scrollableNode.getBoundingClientRect();
  // getBoundingClientRect returns incorrect values for height and bottom of
  // html element
  if (scrollableNode.nodeType === 1) {
    scrollableRect = {
      left: scrollableRect.left,
      right: scrollableRect.right,
      width: scrollableRect.width,
      height: scrollableNode.clientHeight,
      top: scrollableRect.top,
      bottom: scrollableNode.clientHeight - scrollableNode.scrollTop
    };
  }
  let pos = null;

  for (let i = 0; i < directions.length; i++) {
    const dirPos = calcPosition(directions[i], anchorRect, popupRect);
    pos = pos || dirPos;
    if (
      dirPos.top > scrollableRect.top &&
      dirPos.top + popupRect.height < scrollableRect.bottom &&
      dirPos.left > scrollableRect.left &&
      dirPos.left + popupRect.width < scrollableRect.right
    ) {
      return dirPos;
    }
  }
  return pos;
}

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
      } else if (checkDirection(direction, Direction.Left, Direction.Right)) {
        top = anchorRect.top + anchorRect.height / 2 - popupRect.height / 2;
        break;
      }
      break;
    default:
      throw Error(`Invalid auxiliary direction ${direction}`);
  }

  return {top, left};

  function checkDirection(direction, ...directions) {
    return directions.some((it) => it & direction);
  }
}

function auxiliary(d) {
  return d << 4;
}
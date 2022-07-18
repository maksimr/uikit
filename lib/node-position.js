import { findScrollableAncestor } from './find-scrollable-ancestor';

/**
 * @enum {string}
 */
export const Direction = {
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
  Direction.BOTTOM_LEFT,
  Direction.BOTTOM_RIGHT,
  Direction.TOP_LEFT,
  Direction.TOP_RIGHT,
  Direction.LEFT_BOTTOM,
  Direction.LEFT_TOP,
  Direction.RIGHT_BOTTOM,
  Direction.RIGHT_TOP
].join('/');

/**
 * @param {Element} node
 * @returns {{top: number, left: number}}
 */
export function marginBox(node) {
  const rect = node.getBoundingClientRect();
  const style = window.getComputedStyle(node);
  const mTop = parseStylePropToInt(style.marginTop);
  const mLeft = parseStylePropToInt(style.marginLeft);
  const x = (rect.x || 0) - mLeft;
  const y = (rect.y || 0) - mTop;
  return {
    top: y,
    left: x
  };
}

/**
 * @typedef TargetPosition
 * @property {number} top
 * @property {number} left
 */
/**
 * @param {HTMLElement} targetNode
 * @param {HTMLElement} anchorNode
 * @param {Element} positionedParentNode
 * @param {string} [direction]
 * @returns {TargetPosition}
 */
export function calculateTargetPositionRelativeToAnchor(
  targetNode,
  anchorNode,
  positionedParentNode = anchorNode.offsetParent || document.body,
  direction = defaultDirection
) {
  const anchorRect = anchorNode.getBoundingClientRect();
  const targetRect = targetNode.getBoundingClientRect();
  const { left: parentX, top: parentY } = marginBox(positionedParentNode);
  const relLeft = (anchorRect.x || 0) - parentX;
  const relTop = (anchorRect.y || 0) - parentY;
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

    const scrolledNode = findScrollableAncestor(positionedParentNode) || document.body;
    const scrollRect = scrolledNode.getBoundingClientRect();
    const height = scrolledNode.scrollHeight || scrollRect.height;
    const width = scrolledNode.scrollWidth || scrollRect.width;
    const dx = parentX - scrollRect.x;
    const dy = parentY - scrollRect.y;

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

  return /**@type {TargetPosition}*/(targetPosition);
}

function parseStylePropToInt(/**@type {string|null}*/prop) {
  const value = prop && prop !== 'auto' ? parseInt(prop, 10) : 0;
  return isNaN(value) ? 0 : value;
}
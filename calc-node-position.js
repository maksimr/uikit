import { findScrollableElement } from "./find-scrollable-element";
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
 * @param {HTMLElement} targetNode
 * @param {HTMLElement} anchorNode
 * @param {Element} [positionedParentNode]
 * @param {string} [direction]
 * @returns {{top: number, left: number}}
 */
export function calcNodePosition(targetNode, anchorNode, positionedParentNode = anchorNode.offsetParent, direction = defaultDirection) {
    const anchorRect = anchorNode.getBoundingClientRect();
    const targetRect = targetNode.getBoundingClientRect();
    const parentRect = positionedParentNode.getBoundingClientRect();
    const parentStyle = window.getComputedStyle(positionedParentNode);
    const parentMarginTop = parseInt(parentStyle.marginTop);
    const parentMarginLeft = parseInt(parentStyle.marginLeft);
    const parentX = parentRect.x - parentMarginLeft;
    const parentY = parentRect.y - parentMarginTop;
    const relLeft = anchorRect.x - parentX;
    const relTop = anchorRect.y - parentY;
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
        const [main = Direction.BOTTOM, auxiliary = main === Direction.TOP || main === Direction.BOTTOM
            ? Direction.LEFT
            : Direction.BOTTOM] = dir.toLowerCase().split('');
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
        const dx = parentX - scrollRect.x;
        const dy = parentY - scrollRect.y;
        if (dirPosition.top + dy < 0 ||
            dirPosition.top + dy + targetRect.height > height ||
            dirPosition.left + dx < 0 ||
            dirPosition.left + dx + targetRect.width > width) {
            targetPosition = targetPosition || dirPosition;
            continue;
        }
        targetPosition = dirPosition;
        break;
    }
    return targetPosition;
}

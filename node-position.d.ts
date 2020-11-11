/**
 * @param {Element} node
 * @returns {{top: number, left: number}}
 */
export function marginBox(node: Element): {
    top: number;
    left: number;
};
/**
 * @param {HTMLElement} targetNode
 * @param {HTMLElement} anchorNode
 * @param {Element} [positionedParentNode]
 * @param {string} [direction]
 * @returns {{top: number, left: number}}
 */
export function calculateTargetPositionRelativeToAnchor(targetNode: HTMLElement, anchorNode: HTMLElement, positionedParentNode?: Element, direction?: string): {
    top: number;
    left: number;
};
export type Direction = string;
export namespace Direction {
    const BOTTOM_LEFT: string;
    const BOTTOM_RIGHT: string;
    const TOP_LEFT: string;
    const TOP_RIGHT: string;
    const LEFT_TOP: string;
    const LEFT_BOTTOM: string;
    const RIGHT_TOP: string;
    const RIGHT_BOTTOM: string;
}

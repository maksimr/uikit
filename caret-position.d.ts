/**
 * @typedef CaretPosition
 * @property {number} offsetTop position relative to the element
 * @property {number} offsetLeft position relative to the element
 * @property {number} height height of the caret
 * @property {number} x position relative to the positioned parent
 * @property {number} y position relative to the positioned parent
 */
/**
 * @param {HTMLInputElement|HTMLTextAreaElement} element
 * @param {number} positionInText Caret in a text. You can use selectionStart or selectionEnd to get this position
 * @param {Element} [positionedParent]
 * @returns {CaretPosition}
 */
export function getCaretPosition(element: HTMLInputElement | HTMLTextAreaElement, positionInText: number, positionedParent?: Element): CaretPosition;
export type CaretPosition = {
    /**
     * position relative to the element
     */
    offsetTop: number;
    /**
     * position relative to the element
     */
    offsetLeft: number;
    /**
     * height of the caret
     */
    height: number;
    /**
     * position relative to the positioned parent
     */
    x: number;
    /**
     * position relative to the positioned parent
     */
    y: number;
};

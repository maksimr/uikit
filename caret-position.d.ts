/**
* @param {HTMLInputElement|HTMLTextAreaElement} element
* @param {number} positionInText Caret in a text. You can use selectionStart or selectionEnd to get this position
* @param {HTMLElement} [positionedParent]
* @returns {{top: number, height: number, left: number, x: number, y:number}}
*/
export function getCaretPosition(element: HTMLInputElement | HTMLTextAreaElement, positionInText: number, positionedParent?: HTMLElement): {
    top: number;
    height: number;
    left: number;
    x: number;
    y: number;
};

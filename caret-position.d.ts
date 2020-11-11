/**
* @param {HTMLInputElement|HTMLTextAreaElement} element
* @param {number} positionInText Caret in a text. You can use selectionStart or selectionEnd to get this position
* @param {Element} [positionedParent]
* @returns {{offsetTop: number, height: number, offsetLeft: number, x: number, y:number}}
*/
export function getCaretPosition(element: HTMLInputElement | HTMLTextAreaElement, positionInText: number, positionedParent?: Element): {
    offsetTop: number;
    height: number;
    offsetLeft: number;
    x: number;
    y: number;
};

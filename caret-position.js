import { marginBox } from "./node-position";
const ELEMENT_STYLE_PROPERTIES = [
    'boxSizing',
    'width',
    'height',
    'overflowX',
    'overflowY',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'lineHeight',
    'fontFamily',
    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',
    'letterSpacing',
    'wordSpacing'
];
/**
* @param {HTMLInputElement|HTMLTextAreaElement} element
* @param {number} positionInText Caret in a text. You can use selectionStart or selectionEnd to get this position
* @param {Element} [positionedParent]
* @returns {{offsetTop: number, height: number, offsetLeft: number, x: number, y:number}}
*/
export function getCaretPosition(element, positionInText, positionedParent = element.offsetParent) {
    const computedStyle = window.getComputedStyle(element);
    const clone = document.createElement('div');
    clone.style.visibility = 'hidden';
    clone.style.position = 'absolute';
    clone.style.whiteSpace = 'pre-wrap';
    ELEMENT_STYLE_PROPERTIES.forEach((propName) => {
        clone.style[propName] = computedStyle[propName];
    });
    const value = element.value;
    clone.textContent = value.substring(0, positionInText);
    const { top: parentTop, left: parentLeft } = marginBox(positionedParent);
    const domRect = element.getBoundingClientRect();
    const top = domRect.top - parentTop;
    const left = domRect.left - parentLeft;
    clone.style.top = top + 'px';
    clone.style.left = left + 'px';
    const cursor = document.createElement('span');
    /*workaround for zero offset top when we insert new line*/
    cursor.innerText = ' ';
    clone.appendChild(cursor);
    positionedParent.appendChild(clone);
    const offset = {};
    offset.height = cursor.offsetHeight;
    offset.offsetTop = cursor.offsetTop;
    offset.offsetLeft = cursor.offsetLeft;
    offset.y = cursor.offsetTop + top - element.scrollTop;
    offset.x = cursor.offsetLeft + left - element.scrollLeft;
    positionedParent.removeChild(clone);
    return offset;
}

import { marginBox } from "./node-position";
const ELEMENT_STYLE_PROPERTIES = [
    'boxSizing',
    'width',
    'height',
    'overflowWrap',
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
    'wordSpacing',
    'whiteSpace'
];
/**
 * @param {HTMLInputElement|HTMLTextAreaElement} element
 * @param {number} positionInText Caret in a text. You can use selectionStart or selectionEnd to get this position
 * @param {Element} [positionedParent]
 * @returns {{offsetTop: number, height: number, offsetLeft: number, x: number, y:number}}
 */
export function getCaretPosition(element, positionInText, positionedParent = element.offsetParent) {
    var _a;
    const computedStyle = window.getComputedStyle(element);
    const clone = document.createElement('pre');
    clone.style.visibility = 'hidden';
    clone.style.position = 'absolute';
    ELEMENT_STYLE_PROPERTIES.forEach((propName) => {
        clone.style[propName] = computedStyle[propName];
    });
    // ¯\_(ツ)_/¯
    // By default input behave like white-space "pre"
    // but browser set default value for white-space equals to "normal"
    if (((_a = element.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'input' &&
        clone.style.whiteSpace === 'normal') {
        clone.style.whiteSpace = 'pre';
    }
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
    cursor.innerHTML = '&#8203;';
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

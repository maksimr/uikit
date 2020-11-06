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
* @param {HTMLElement} [positionedParent]
* @returns {{top: number, height: number, left: number, x: number, y:number}}
*/
export function getCaretPosition(element, positionInText, positionedParent = document.body) {
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
    const domRect = element.getBoundingClientRect();
    const y = positionedParent.scrollTop;
    const x = positionedParent.scrollLeft;
    const top = domRect.top + y;
    const left = domRect.left + x;
    clone.style.top = top + 'px';
    clone.style.left = left + 'px';
    const cursor = document.createElement('span');
    /*workaround for zero offset top when we insert new line*/
    cursor.innerText = ' ';
    clone.appendChild(cursor);
    positionedParent.appendChild(clone);
    const offset = {};
    offset.top = cursor.offsetTop;
    offset.height = cursor.offsetHeight;
    offset.left = cursor.offsetLeft;
    offset.y = offset.top + top - element.scrollTop;
    offset.x = offset.left + left - element.scrollLeft;
    positionedParent.removeChild(clone);
    return offset;
}

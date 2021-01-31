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
 * @param {Element} positionedParent
 * @returns {CaretPosition}
 */
export function getCaretPosition(element, positionInText, positionedParent = element.offsetParent || document.body) {
  const computedStyle = window.getComputedStyle(element);

  const clone = document.createElement('pre');
  clone.style.visibility = 'hidden';
  clone.style.position = 'absolute';
  ELEMENT_STYLE_PROPERTIES.forEach((propName) => {
    clone.style[/**@type {any}*/(propName)] = computedStyle[/**@type {any}*/(propName)];
  });

  // ¯\_(ツ)_/¯
  // By default input behave like white-space "pre"
  // but browser set default value for white-space equals to "normal"
  if (
    element.tagName?.toLowerCase() === 'input' &&
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
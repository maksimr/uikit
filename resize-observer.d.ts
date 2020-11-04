/**
 * @param {HTMLElement} element
 * @param {function} listener
 * @return {function(...[*]=)} Remove listener function
 */
export function addResizeListener(element: HTMLElement, listener: Function): (arg0: [any][] | undefined) => any;

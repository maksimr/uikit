/**
 * @param {Element} element
 * @return {Element|null}
 */
export function findScrollableElement(element) {
    while (element) {
        const overflow = element.nodeType !== 1 ? '' : window.getComputedStyle(element).overflow;
        if (overflow === 'visible' || overflow === '') {
            /**
             * @type {Element}
             */
            // @ts-ignore
            element = element.parentNode;
            continue;
        }
        break;
    }
    return element;
}

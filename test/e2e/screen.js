import { render, unmountComponentAtNode } from 'react-dom';

beforeAll(function() {
  document.body.style.padding = '0';
  document.body.style.margin = '0';
  document.body.style.width = '100vw';
  document.body.style.height = '100vh';
});

/**@type {HTMLElement|null}*/
let rootNode;
beforeEach(function() {
  rootNode = document.createElement('div');
  rootNode.setAttribute('id', 'app');
  document.body.appendChild(rootNode);
});

afterEach(function() {
  if (rootNode) {
    unmountComponentAtNode(rootNode);
    rootNode?.parentNode?.removeChild(rootNode);
    rootNode = null;
  }
});

/**
 * @param {JSX.Element|string} element
 * @param {function} [callback]
 * @returns {Element}
 */
export function screen(element, callback) {
  return render(element, rootNode, callback);
}
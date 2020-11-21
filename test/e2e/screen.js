import { render, unmountComponentAtNode } from 'react-dom';

let rootNode = null;
beforeEach(function() {
  rootNode = document.createElement('div');
  rootNode.setAttribute('id', 'app');
  document.body.appendChild(rootNode);
});

afterEach(function() {
  if (rootNode) {
    unmountComponentAtNode(rootNode);
    rootNode.parentNode.removeChild(rootNode);
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
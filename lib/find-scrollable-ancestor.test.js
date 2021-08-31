import { findScrollableAncestor } from './find-scrollable-ancestor';

it('should find scrollable element', function() {
  const rootNode = document.createElement('div');
  const scrollableNode = document.createElement('div');
  const node = document.createElement('div');

  scrollableNode.style.overflow = 'auto';
  rootNode.appendChild(scrollableNode);
  scrollableNode.appendChild(node);

  expect(findScrollableAncestor(node)).toEqual(scrollableNode);
});

it('should return null if we could not find any scrollable element', function() {
  const rootNode = document.createElement('div');
  const nodeA = document.createElement('div');
  const nodeB = document.createElement('div');

  rootNode.appendChild(nodeA);
  nodeA.appendChild(nodeB);

  expect(findScrollableAncestor(nodeB)).toEqual(null);
});
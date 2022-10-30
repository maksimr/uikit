import { findScrollableContainer } from './find-scrollable-container';

describe('findScrollableContainer', () => {
  /**@type {HTMLElement}*/
  let rootNode;
  beforeAll(() => {
    rootNode = document.createElement('div');
    document.body.appendChild(rootNode);
  });

  afterAll(() => {
    rootNode.parentElement?.removeChild(rootNode);
  });

  it('should find scrollable element', function() {
    const scrollableNode = document.createElement('div');
    const node = document.createElement('div');

    scrollableNode.style.overflow = 'auto';
    rootNode.appendChild(scrollableNode);
    scrollableNode.appendChild(node);

    expect(findScrollableContainer(node)).toEqual(scrollableNode);
  });

  it('should return null if we could not find any scrollable element', function() {
    const nodeA = document.createElement('div');
    const nodeB = document.createElement('div');

    rootNode.appendChild(nodeA);
    nodeA.appendChild(nodeB);

    expect(findScrollableContainer(nodeB)).toEqual(null);
  });

  it('should ignore non element nodes', function() {
    const scrollableNode = document.createElement('div');
    const textNode = document.createTextNode('');

    scrollableNode.style.overflow = 'auto';
    rootNode.appendChild(scrollableNode);
    scrollableNode.appendChild(textNode);

    expect(findScrollableContainer(textNode)).toEqual(scrollableNode);
  });
});

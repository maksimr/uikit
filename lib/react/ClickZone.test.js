import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import React from 'react';
import { ClickZone } from './ClickZone';

describe.only('ClickZone', function() {
  let rootNode;
  let onClickAway;
  beforeEach(function() {
    rootNode = document.createElement('div');
    onClickAway = jest.fn();

    act(() => {
      render(<ClickZone onClickAway={onClickAway}><div id="foo">Hello World!</div></ClickZone>, rootNode);
    });
  });

  it('should click away zone', function() {
    click(rootNode);
    expect(onClickAway).toHaveBeenCalled();
  });

  it('should not fire click away if we click inside zone', () => {
    click(rootNode.querySelector('#foo'));
    expect(onClickAway).not.toHaveBeenCalled();
  });

  function click(node) {
    act(() => {
      const clickEvent = new MouseEvent('click', { bubbles: true });
      node.dispatchEvent(clickEvent);
      document.dispatchEvent(clickEvent);
    });
  }
});


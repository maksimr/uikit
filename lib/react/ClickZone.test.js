import { act } from 'react-dom/test-utils';
import { render, createPortal } from 'react-dom';
import React from 'react';
import { ClickZone } from './ClickZone';

describe('ClickZone', function() {
  /**@type {HTMLElement}*/ let rootNode;
  /**@type {function}*/ let onClickAway;
  /**@type {HTMLElement}*/ let portalNode;
  beforeEach(function() {
    portalNode = document.createElement('div');
    rootNode = document.createElement('div');
    onClickAway = jest.fn();

    act(() => {
      render(
        <ClickZone onClickAway={onClickAway}>
          <div id="foo">
            <UsePortal/>
          </div>
        </ClickZone>,
        rootNode);
    });

    function UsePortal() {
      return createPortal(<div id="portal"/>, portalNode);
    }
  });

  it('should handle click away zone', function() {
    click(rootNode);
    expect(onClickAway).toHaveBeenCalled();
  });

  it('should not fire click away if we click inside zone', () => {
    click(rootNode.querySelector('#foo'));
    expect(onClickAway).not.toHaveBeenCalled();
  });

  it('should not fire click inside portal which in the same virual dom tree', () => {
    click(portalNode.querySelector('#portal'));
    expect(onClickAway).not.toHaveBeenCalled();
  });

  function click(/**@type {Element|null}*/node) {
    if (node) {
      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true });
        node.dispatchEvent(clickEvent);
        document.dispatchEvent(clickEvent);
      });
    }
  }
});


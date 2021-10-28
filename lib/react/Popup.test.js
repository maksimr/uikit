import { render } from '@testing-library/react';
import { Popup, PopupProvider } from './Popup';
import React from 'react';

describe('Popup', function() {
  /**@type {HTMLElement}*/
  let rootNode;
  beforeEach(function() {
    rootNode = document.createElement('div');
  });

  it('should render popup', function() {
    render(
      <Popup anchorNode={rootNode} parentNode={rootNode}>
        <b>Hello World!</b>
      </Popup>
    );

    expect(text(rootNode)).toEqual('Hello World!');
  });

  it('should not crash if do not pass anchor node should just return null', function() {
    expect(() => {
      render(
        <Popup>
          <b>Hello World!</b>
        </Popup>
      );
    }).not.toThrowError();
  });

  it('should get parent node as anchor node if user do not pass anchor explicitly', function() {
    render(
      <div>
        <Popup parentNode={rootNode}>
          <b>Hello World!</b>
        </Popup>
      </div>
    );

    expect(text(rootNode)).toEqual('Hello World!');
  });

  it('should rerender popup', function() {
    const { rerender } = render(
      <Popup anchorNode={rootNode} parentNode={rootNode}>
        <b>Hello World!</b>
      </Popup>
    );

    rerender(
      <Popup anchorNode={rootNode} parentNode={rootNode}>
        <b>Hello Guest!</b>
      </Popup>
    );

    expect(text(rootNode)).toEqual('Hello Guest!');
  });

  it('should render popup in a different subtree', function() {
    const popupParentNode = document.createElement('div');

    render(
      <Popup anchorNode={rootNode} parentNode={popupParentNode}>
        <b>Hello World!</b>
      </Popup>
    );

    expect(text(popupParentNode)).toEqual('Hello World!');
  });

  it('should allow setup popup by context', function() {
    const popupParentNode = document.createElement('div');
    render(
      <PopupProvider value={{ parentNode: popupParentNode }}>
        <Popup anchorNode={rootNode}>
          <b>Hello World!</b>
        </Popup>
      </PopupProvider>
    );

    expect(text(popupParentNode)).toEqual('Hello World!');
  });

  it('should pass attributes to popup element', function() {
    render(
      <Popup anchorNode={rootNode} parentNode={rootNode} className='foo'>
        <b>Hello World!</b>
      </Popup>
    );

    expect(getPopupNode(rootNode).classList.contains('foo')).toEqual(true);
  });

  it('should use passed styles', function() {
    render(
      <Popup anchorNode={rootNode} parentNode={rootNode} style={{ top: 20 }} />
    );

    expect(getPopupNode(rootNode).style.top).toEqual('20px');
  });

  function text(/**@type {HTMLElement}*/parentNode) {
    return parentNode.querySelector('b')?.innerHTML;
  }

  function getPopupNode(/**@type {HTMLElement}*/parentNode) {
    return (/**@type {HTMLElement}*/(parentNode.querySelector('[data-role=popup]')));
  }
});
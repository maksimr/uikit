import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Popup, PopupProvider } from './Popup';
import React from 'react';

describe('Popup', function() {
  let rootNode;
  beforeEach(function() {
    rootNode = document.createElement('div');
  });

  it('should render popup', function() {
    act(() => {
      render(
        <Popup anchorNode={rootNode} parentNode={rootNode}>
          <b>Hello World!</b>
        </Popup>,
        rootNode);
    });

    expect(text(rootNode)).toEqual('Hello World!');
  });

  it('should not crash if do not pass anchor node should just return null', function() {
    expect(() => {
      act(() => {
        render(
          <Popup>
            <b>Hello World!</b>
          </Popup>,
          rootNode);
      });
    }).not.toThrowError();
  });

  it('should rerender popup', function() {
    act(() => {
      render(
        <Popup anchorNode={rootNode} parentNode={rootNode}>
          <b>Hello World!</b>
        </Popup>,
        rootNode);
    });

    act(() => {
      render(
        <Popup anchorNode={rootNode} parentNode={rootNode}>
          <b>Hello Guest!</b>
        </Popup>,
        rootNode);
    });

    expect(text(rootNode)).toEqual('Hello Guest!');
  });

  it('should render popup in a different subtree', function() {
    const popupParentNode = document.createElement('div');

    act(() => {
      render(
        <Popup anchorNode={rootNode} parentNode={popupParentNode}>
          <b>Hello World!</b>
        </Popup>,
        rootNode);
    });

    expect(text(popupParentNode)).toEqual('Hello World!');
  });

  it('should allow setup popup by context', function() {
    const popupParentNode = document.createElement('div');
    act(() => {
      render(
        <PopupProvider value={{ parentNode: popupParentNode }}>
          <Popup anchorNode={rootNode}>
            <b>Hello World!</b>
          </Popup>
        </PopupProvider>,
        rootNode);
    });

    expect(text(popupParentNode)).toEqual('Hello World!');
  });

  it('should pass attributes to popup element', function() {
    act(() => {
      render(
        <Popup anchorNode={rootNode} parentNode={rootNode} className='foo'>
          <b>Hello World!</b>
        </Popup>,
        rootNode);
    });

    expect(getPopupNode(rootNode).classList.contains('foo')).toEqual(true);
  });

  function text(parentNode) {
    return parentNode.querySelector('b').innerHTML;
  }

  function getPopupNode(parentNode) {
    return parentNode.querySelector('[data-role=popup]');
  }
});
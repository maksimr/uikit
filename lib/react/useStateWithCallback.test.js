import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import React from 'react';
import { useStateWithCallback } from './useStateWithCallback';

describe('useStateWithCallback', function() {
  /**@type {HTMLElement}*/
  let rootNode;
  beforeEach(function() {
    rootNode = document.createElement('div');
  });

  it('should call callback after state update', function() {
    const callback = jest.fn();
    const Foo = createTestButtonComponent(1, callback);

    act(() => {
      render(<Foo/>, rootNode);
    });

    clickOnButton(rootNode);
    expect(callback).toHaveBeenCalledTimes(1);

    clickOnButton(rootNode);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should work when user pass function as state', function() {
    const callback = jest.fn();
    const Foo = createTestButtonComponent(() => 1, callback);

    act(() => {
      render(<Foo/>, rootNode);
    });

    clickOnButton(rootNode);
    expect(callback).toHaveBeenCalledTimes(1);

    clickOnButton(rootNode);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should correctly work without callback', function() {
    const Foo = createTestButtonComponent(1);

    act(() => {
      render(<Foo/>, rootNode);
    });

    const buttonNode = clickOnButton(rootNode);
    expect(buttonNode?.innerHTML).toEqual('1');
  });

  function createTestButtonComponent(/**@type {any}*/stateOnClick, /**@type {any}*/callback) {
    return () => {
      const [state, setState] = useStateWithCallback(0);
      return <button onClick={() => setState(stateOnClick, callback)}>{state}</button>;
    };
  }

  function clickOnButton(/**@type {Element}*/rootNode) {
    const buttonNode = rootNode.querySelector('button');
    click(buttonNode);
    return buttonNode;
  }

  function click(/**@type {Element|null}*/node) {
    act(() => {
      node?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  }
});
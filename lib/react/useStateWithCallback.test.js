import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { useStateWithCallback } from './useStateWithCallback';
import { createSpy } from './../../test/test-util';

describe('useStateWithCallback', function() {
  it('should call callback after state update', function() {
    const callback = createSpy();
    const Foo = createTestButtonComponent(1, callback);

    const { container: rootNode } = render(<Foo />);

    clickOnButton(rootNode);
    expect(callback).toHaveBeenCalledTimes(1);

    clickOnButton(rootNode);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should work when user pass function as state', function() {
    const callback = createSpy();
    const Foo = createTestButtonComponent(() => 1, callback);

    const { container: rootNode } = render(<Foo />);

    clickOnButton(rootNode);
    expect(callback).toHaveBeenCalledTimes(1);

    clickOnButton(rootNode);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should correctly work without callback', function() {
    const Foo = createTestButtonComponent(1);

    const { container: rootNode } = render(<Foo />);

    const buttonNode = clickOnButton(rootNode);
    expect(buttonNode?.innerHTML).toEqual('1');
  });

  function createTestButtonComponent(/**@type {number | (() => number)}*/stateOnClick, /**@type {(...args: any[]) => void}*/callback) {
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
    if (node) {
      fireEvent.click(node);
    }
  }
});
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import React from 'react';
import { ControllerLayer, useController } from './ControllerLayer';

describe('ControllerLayer', function() {
  class FooController {
    text() {
      return 'foo';
    }
  }

  class BarController {
    text() {
      return 'bar';
    }
  }

  /**@type {HTMLElement}*/let rootNode;
  beforeEach(function() {
    rootNode = document.createElement('div');
  });

  it('should pass controller through context', function() {
    const ctrl = new FooController();
    act(() => {
      render(
        <ControllerLayer value={ctrl}>
          <Foo/>
        </ControllerLayer>,
        rootNode);
    });

    expect(rootNode.querySelector('b')?.innerHTML).toEqual(ctrl.text());
  });

  it('should allow to use more than one controller', function() {
    const fooCtrl = new FooController();
    const barCtrl = new BarController();
    act(() => {
      render(
        <ControllerLayer value={barCtrl}>
          <ControllerLayer value={fooCtrl}>
            <FooBar/>
          </ControllerLayer>
        </ControllerLayer>,
        rootNode);
    });

    expect(rootNode.querySelector('b')?.innerHTML).toEqual(fooCtrl.text() + barCtrl.text());
  });

  function Foo() {
    const ctrl = useController(FooController);
    return <b>{ctrl.text()}</b>;
  }

  function FooBar() {
    const fooCtrl = useController(FooController);
    const barCtrl = useController(BarController);
    return <b>{fooCtrl.text()}{barCtrl.text()}</b>;
  }
});
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ControllerProvider, useController } from './Controller';

describe('Controller', function() {
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

  it('should pass controller through context', async function() {
    const ctrl = new FooController();
    render(
      <ControllerProvider value={ctrl}>
        <Foo />
      </ControllerProvider>
    );

    expect((await screen.findByTestId('text'))?.innerHTML).toEqual(ctrl.text());
  });

  it('should allow to use more than one controller', async function() {
    const fooCtrl = new FooController();
    const barCtrl = new BarController();
    render(
      <ControllerProvider value={barCtrl}>
        <ControllerProvider value={fooCtrl}>
          <FooBar />
        </ControllerProvider>
      </ControllerProvider>
    );

    expect((await screen.findByTestId('text'))?.innerHTML).toEqual(fooCtrl.text() + barCtrl.text());
  });

  it('should support multiple types/interfaces for one controller', async function() {
    class FooBarController {
      text() {
        return 'foobar';
      }
    }
    const foobarCtrl = new FooBarController();

    render(
      <ControllerProvider
        value={foobarCtrl}
        type={[FooController, BarController]}>
        <FooBar />
      </ControllerProvider>
    );

    expect((await screen.findByTestId('text'))?.innerHTML).toEqual(foobarCtrl.text() + foobarCtrl.text());
  });

  it('should support extended/inherited controller', async function() {
    class ZooController extends FooController {
      text() {
        return 'foozoo';
      }
    }
    const zooCtrl = new ZooController();

    render(
      <ControllerProvider value={zooCtrl} >
        <Foo />
      </ControllerProvider>
    );

    expect((await screen.findByTestId('text'))?.innerHTML).toEqual(zooCtrl.text());
  });

  function Foo() {
    const ctrl = useController(FooController);
    return <b data-testid="text">{ctrl.text()}</b>;
  }

  function FooBar() {
    const fooCtrl = useController(FooController);
    const barCtrl = useController(BarController);
    return <b data-testid="text">{fooCtrl.text()}{barCtrl.text()}</b>;
  }
});
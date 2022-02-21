import { act } from 'react-dom/test-utils';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { Cursor, StoreLayer, useStore } from './StoreLayer';
import { Store } from '../store';
import { createSpy } from './../../test/test-util';
import produce from 'immer';

describe('StoreLayer', function() {
  /**@type {Store<*>}*/
  let store;
  beforeEach(function() {
    store = new Store({ counter: 0 }, (...args) => produce(...args));
  });

  it('should pass store to components', function() {
    const { container } = render(
      <StoreLayer store={store}>
        <Foo />
      </StoreLayer>
    );

    expect(container.querySelector('b')?.innerHTML).toEqual('0');
  });

  it('should redraw component on store`s state change', function() {
    const { container } = render(
      <StoreLayer store={store}>
        <Foo />
      </StoreLayer>
    );

    act(() => {
      store.swap((state) => ({ counter: state.counter + 1 }));
    });

    expect(container.querySelector('b')?.innerHTML).toEqual('1');
  });

  it('should update store state from a component', function() {
    const { container } = render(
      <StoreLayer store={store}>
        <Foo />
      </StoreLayer>
    );

    fireEvent.click(/**@type {HTMLElement}*/(container.querySelector('button')));
    expect(container.querySelector('b')?.innerHTML).toEqual('1');
  });

  it('should redraw only components which store state has changed', function() {
    const qa = (/**@type {*}*/state) => state.a;
    const qb = (/**@type {*}*/state) => state.b;

    /**
     * @type {function(): JSX.Element}
     */
    const App = createSpy(() => <div><A /><B /></div>);
    /**@type {import('react').FunctionComponent}*/
    const A = createSpy(() => {
      useStore(qa);
      return <div />;
    });
    /**@type {import('react').FunctionComponent}*/
    const B = createSpy(() => {
      useStore(qb);
      return <div />;
    });

    store.swap(() => ({ a: '', b: '' }));
    render(
      <StoreLayer store={store}>
        <App />
      </StoreLayer>
    );

    expect(App).toHaveBeenCalledTimes(1);
    expect(A).toHaveBeenCalledTimes(1);
    expect(B).toHaveBeenCalledTimes(1);

    act(() => {
      store.swap((state) => ({ ...state, b: 'change' }));
    });

    expect(App).toHaveBeenCalledTimes(1);
    expect(A).toHaveBeenCalledTimes(1);
    expect(B).toHaveBeenCalledTimes(2);
  });

  it('should pass only part of the story', function() {
    const Baz = () => {
      const [state, setState] = useStore();
      return (
        <div>
          <button onClick={() => setState((state) => void (state.counter += 1))} />
          <b>{state.counter}</b>
        </div>
      );
    };

    store.swap((state) => {
      state.foo = { counter: 0 };
    });

    const { container } = render(
      <StoreLayer store={store}>
        <Cursor query={(state) => state.foo}>
          <Baz />
        </Cursor>
      </StoreLayer>
    );

    expect(container.querySelector('b')?.innerHTML).toEqual('0');

    fireEvent.click(/**@type {HTMLElement}*/(container.querySelector('button')));
    expect(container.querySelector('b')?.innerHTML).toEqual('1');
    expect(store.value.counter).toEqual(0);
    expect(store.value.foo.counter).toEqual(1);
  });

  function Foo() {
    const [state, setState] = useStore();
    return (
      <div>
        <button onClick={() => setState((state) => ({ counter: state.counter + 1 }))} />
        <b>{state.counter}</b>
      </div>
    );
  }
});
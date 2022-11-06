import { act } from 'react-dom/test-utils';
import { render, fireEvent } from '@testing-library/react';
import produce from 'immer';
import { StoreCursor, StoreProvider, useStore } from './Store';
import { createStore } from '../store';
import { createSpy } from '../../test/test-util';
import { shallowEqual } from './shallowEqual';

describe('Store', function() {
  /**@type {import('./Store').Store<*>}*/
  let store;
  beforeEach(function() {
    store = createStore({ counter: 0 }, (...args) => produce(...args));
  });

  it('should pass store to components', function() {
    const { container } = render(
      <StoreProvider store={store}>
        <Foo />
      </StoreProvider>
    );

    expect(container.querySelector('b')?.innerHTML).toEqual('0');
  });

  it('should redraw component on store`s state change', function() {
    const { container } = render(
      <StoreProvider store={store}>
        <Foo />
      </StoreProvider>
    );

    act(() => {
      store.swap((state) => ({ counter: state.counter + 1 }));
    });

    expect(container.querySelector('b')?.innerHTML).toEqual('1');
  });

  it('should update store state from a component', function() {
    const { container } = render(
      <StoreProvider store={store}>
        <Foo />
      </StoreProvider>
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
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
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
    const Baz = ({ id = '' }) => {
      const [state, setState] = useStore();
      return (
        <div id={id}>
          <button onClick={() => setState((state) => void (state.counter += 1))} />
          <b>{state.counter}</b>
        </div>
      );
    };

    store.swap((state) => {
      state.foo = { counter: 0 };
      state.bar = { counter: 0 };
    });

    const { container } = render(
      <StoreProvider store={store}>
        <StoreCursor query={(state) => state.foo}>
          <Baz id="A" />
        </StoreCursor>
        <StoreCursor query={(state) => state.bar}>
          <Baz id="B" />
        </StoreCursor>
      </StoreProvider>
    );

    expect(container.querySelector('#A b')?.innerHTML).toEqual('0');
    expect(container.querySelector('#B b')?.innerHTML).toEqual('0');

    fireEvent.click(/**@type {HTMLElement}*/(container.querySelector('#A button')));
    expect(container.querySelector('#A b')?.innerHTML).toEqual('1');
    expect(container.querySelector('#B b')?.innerHTML).toEqual('0');
    expect(store.value.counter).toEqual(0);
    expect(store.value.foo.counter).toEqual(1);
    expect(store.value.bar.counter).toEqual(0);

    fireEvent.click(/**@type {HTMLElement}*/(container.querySelector('#B button')));
    expect(container.querySelector('#A b')?.innerHTML).toEqual('1');
    expect(container.querySelector('#B b')?.innerHTML).toEqual('1');
    expect(store.value.foo.counter).toEqual(1);
    expect(store.value.bar.counter).toEqual(1);
  });

  it('should allow pass custom equality function', function() {
    const ShallowComponent /**@type {function(): JSX.Element}*/ = createSpy(() => {
      useStore(() => ({ foo: 'foo' }), shallowEqual);
      return <div />;
    });

    store.swap(() => ({}));
    render(
      <StoreProvider store={store}>
        <ShallowComponent />
      </StoreProvider>
    );

    act(() => store.swap((state) => ({ ...state })));
    act(() => store.swap((state) => ({ ...state })));
    act(() => store.swap((state) => ({ ...state })));
    expect(ShallowComponent).toHaveBeenCalledTimes(1);
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
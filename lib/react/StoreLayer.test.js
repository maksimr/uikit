import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import React from 'react';
import { StoreLayer, useStore } from './StoreLayer';
import { Store } from '../Store';

describe('StoreLayer', function() {
  /**@type {HTMLElement}*/
  let rootNode;
  /**@type {Store<*>}*/
  let store;
  beforeEach(function() {
    rootNode = document.createElement('div');
    store = new Store({ counter: 0 }, (state, fn) => fn(state));
  });

  it('should pass store to components', function() {
    act(() => {
      render(
        <StoreLayer store={store}>
          <Foo/>
        </StoreLayer>,
        rootNode);
    });

    expect(rootNode.querySelector('b')?.innerHTML).toEqual('0');
  });

  it('should redraw component on store`s state change', function() {
    act(() => {
      render(
        <StoreLayer store={store}>
          <Foo/>
        </StoreLayer>,
        rootNode);
    });

    act(() => {
      store.swap((state) => ({ counter: state.counter + 1 }));
    });

    expect(rootNode.querySelector('b')?.innerHTML).toEqual('1');
  });

  it('should update store state from a component', function() {
    act(() => {
      render(
        <StoreLayer store={store}>
          <Foo/>
        </StoreLayer>,
        rootNode);
    });

    act(() => {
      rootNode.querySelector('button')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(rootNode.querySelector('b')?.innerHTML).toEqual('1');
  });

  it('should redraw only components which store state has changed', function() {
    const qa = (/**@type {*}*/state) => state.a;
    const qb = (/**@type {*}*/state) => state.b;

    /**
     * @type {function(): JSX.Element}
     */
    const App = jest.fn(() => <div><A/><B/></div>);
    const A = jasmine.createSpy('A', () => {
      useStore(qa);
      return <div/>;
    }).and.callThrough();
    const B = jasmine.createSpy('B', () => {
      useStore(qb);
      return <div/>;
    }).and.callThrough();

    store.swap(() => ({ a: '', b: '' }));
    act(() => {
      render(
        <StoreLayer store={store}>
          <App/>
        </StoreLayer>,
        rootNode);
    });

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

  function Foo() {
    const [state, setState] = useStore();
    return (
      <div>
        <button onClick={() => setState((state) => ({ counter: state.counter + 1 }))}/>
        <b>{state.counter}</b>
      </div>
    );
  }
});
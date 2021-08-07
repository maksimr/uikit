import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Switch, Route, useCurrentRoute } from "./Router";

describe('Router', function() {
  it('should render matched route', function() {
    const rootNode = document.createElement('div');
    const User = jest.fn().mockReturnValue('Hello World!');

    act(() => {
      render(
        <Switch path="/user/1">
          <Route when="/user/:id">
            <User />
          </Route>
        </Switch>
        , rootNode);
    });

    expect(User).toHaveBeenCalled();
  });

  it('should call otherwise', function() {
    const rootNode = document.createElement('div');
    const User = jest.fn().mockReturnValue('Hello World!');
    const otherwise = jest.fn().mockReturnValue(null);

    act(() => {
      render(
        <Switch path="/page/1" otherwise={otherwise}>
          <Route when="/user/:id"><User /></Route>
        </Switch>
        , rootNode);
    });

    expect(otherwise).toHaveBeenCalled();
  });

  it('should do nothing if user does not pass otherwise', () => {
    const rootNode = document.createElement('div');

    expect(() => {
      act(() => {
        render(
          <Switch path="/page/1"/>
          , rootNode);
      });
    }).not.toThrow();
  });

  it('should allow pass component as otherwise', function() {
    const rootNode = document.createElement('div');
    const User = jest.fn().mockReturnValue('Hello World!');
    const Otherwise = jest.fn().mockReturnValue(null);

    act(() => {
      render(
        <Switch path="/page/1" otherwise={<Otherwise />}>
          <Route when="/user/:id"><User /></Route>
        </Switch>
        , rootNode);
    });

    expect(Otherwise).toHaveBeenCalled();
  });

  it('should get current route by hook', function() {
    const rootNode = document.createElement('div');
    const User = () => {
      const route = useCurrentRoute();
      return <>{route?.params?.id}</>;
    };

    act(() => {
      render(
        <Switch path="/user/1">
          <Route when="/user/:id"><User /></Route>
        </Switch>
        , rootNode);
    });

    expect(rootNode.innerHTML).toEqual('1');
  });
});
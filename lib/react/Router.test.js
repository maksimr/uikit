import React from 'react';
import { render } from '@testing-library/react';
import { Switch, Route, useCurrentRoute } from './Router';
import { expect } from '@jest/globals';

describe('Router', function() {
  it('should render matched route', function() {
    const User = jest.fn().mockReturnValue('Hello World!');

    render(
      <Switch path="/user/1">
        <Route when="/user/:id">
          <User />
        </Route>
      </Switch>
    );

    expect(User).toHaveBeenCalled();
  });

  it('should allow pass a function to route', function() {
    const userRouteFn = jest.fn().mockReturnValue(<div>Hello World!</div>);

    render(
      <Switch path="/user/1">
        <Route when="/user/:id">
          {userRouteFn}
        </Route>
      </Switch>
    );

    expect(userRouteFn).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { 'id': '1' },
        path: '/user/1'
      })
    );
  });

  it('should call otherwise', function() {
    const User = jest.fn().mockReturnValue('Hello World!');
    const otherwise = jest.fn().mockReturnValue(null);

    render(
      <Switch path="/page/1" otherwise={otherwise}>
        <Route when="/user/:id"><User /></Route>
      </Switch>
    );

    expect(otherwise).toHaveBeenCalled();
  });

  it('should do nothing if user does not pass otherwise', () => {
    expect(() => {
      render(
        <Switch path="/page/1" />
      );
    }).not.toThrow();
  });

  it('should allow pass component as otherwise', function() {
    const User = jest.fn().mockReturnValue('Hello World!');
    const Otherwise = jest.fn().mockReturnValue(null);

    render(
      <Switch path="/page/1" otherwise={<Otherwise />}>
        <Route when="/user/:id"><User /></Route>
      </Switch>
    );

    expect(Otherwise).toHaveBeenCalled();
  });

  it('should get current route by hook', function() {
    const User = () => {
      const route = useCurrentRoute();
      return <>{route?.params?.id}</>;
    };

    const { container } = render(
      <Switch path="/user/1">
        <Route when="/user/:id"><User /></Route>
      </Switch>
    );

    expect(container.innerHTML).toEqual('1');
  });
});
import { render } from '@testing-library/react';
import { Switch, Route, useCurrentRoute } from './Router';
import { createSpy, objectContaining } from './../../test/test-util';

describe('Router', function() {
  it('should render matched route', function() {
    const User = createSpy().and.returnValue('Hello World!');

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
    const userRouteFn = createSpy().and.returnValue(<div>Hello World!</div>);

    render(
      <Switch path="/user/1">
        <Route when="/user/:id">
          {userRouteFn}
        </Route>
      </Switch>
    );

    expect(userRouteFn).toHaveBeenCalledWith(
      objectContaining({
        params: { 'id': '1' },
        path: '/user/1'
      })
    );
  });

  it('should call otherwise', function() {
    const User = createSpy().and.returnValue('Hello World!');
    const otherwise = createSpy().and.returnValue(null);

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
    const User = createSpy().and.returnValue('Hello World!');
    const Otherwise = createSpy().and.returnValue(null);

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
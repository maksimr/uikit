import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Switch, Route, useCurrentRoute } from "./Router";
describe('Router', function () {
    it('should render matched route', function () {
        const rootNode = document.createElement('div');
        const routeRender = jest.fn().mockReturnValue('Hello World!');
        act(() => {
            render(React.createElement(Switch, { path: "/user/1" },
                React.createElement(Route, { when: "/user/:id", render: routeRender })), rootNode);
        });
        expect(routeRender).toHaveBeenCalled();
    });
    it('should call otherwise', function () {
        const rootNode = document.createElement('div');
        const routeRender = jest.fn().mockReturnValue('Hello World!');
        const otherwise = jest.fn().mockReturnValue(null);
        act(() => {
            render(React.createElement(Switch, { path: "/page/1", otherwise: otherwise },
                React.createElement(Route, { when: "/user/:id", render: routeRender })), rootNode);
        });
        expect(otherwise).toHaveBeenCalled();
    });
    it('should get current route by hook', function () {
        const rootNode = document.createElement('div');
        const User = () => {
            const route = useCurrentRoute();
            return route.params.id;
        };
        act(() => {
            render(React.createElement(Switch, { path: "/user/1" },
                React.createElement(Route, { when: "/user/:id", render: () => React.createElement(User, null) })), rootNode);
        });
        expect(rootNode.innerHTML).toEqual('1');
    });
});

import React, { Children, createContext, useContext } from 'react';
import { match } from '../path';

const CurrentRouteContext = createContext(null);

// eslint-disable-next-line valid-jsdoc
/**
 * @param {{path: string, otherwise?: function():JSX.Element, children: (Array<JSX.Element> | JSX.Element)}} props 
 * @returns {JSX.Element}
 */
export function Switch({ path, otherwise, children }) {
  /**
   * @type {JSX.Element | null}
   */
  let route = null;
  let params = null;
  Children.forEach(children, (child) => {
    if (!route && child.type === Route && (params = match(child.props.when, path))) {
      route = child;
    }
  });
  const currentRoute = route ? { path: path, route: route, params: params } : { path: path };
  return wrapInCurrentRouteContext(currentRoute, route ?
    route.props.render(params) :
    (otherwise ? otherwise() : null)
  );
}

/**
 * @param {any} currentRoute 
 * @param {JSX.Element} children 
 * @returns {JSX.Element}
 */
function wrapInCurrentRouteContext(currentRoute, children) {
  return children ? (
    <CurrentRouteContext.Provider value={currentRoute}>
      {children}
    </CurrentRouteContext.Provider>
  ) : null;
}

/**
 * @param {{when: string, render: function():JSX.Element}} props
 * @returns {JSX.Element}
 */
// eslint-disable-next-line no-unused-vars
export function Route(props) {
  return null;
}

export function useCurrentRoute() {
  return useContext(CurrentRouteContext);
}
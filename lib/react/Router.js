import React, { Children, createContext, useContext } from 'react';
import { match } from '../path';

const CurrentRouteContext = createContext(/**@type {RouteData|null}*/(null));

/**
 * @typedef RouteData
 * @property {string} path
 * @property {(Object<string,string>|null)} [params]
 * @property {RouteElement} [route]
 */

// eslint-disable-next-line valid-jsdoc
/**
 * @param {{path: string, otherwise?: function():JSX.Element, children: (RouteElement[] | RouteElement)}} props
 * @returns {JSX.Element|null}
 */
export function Switch({ path, otherwise, children }) {
  let route = /**@type {RouteElement | null}*/(null);
  let params = null;
  Children.forEach(children, (child) => {
    if (!route && child.type === Route && (params = match(child.props.when, path))) {
      route = child;
    }
  });
  /**@type {RouteData}*/
  const currentRoute = route ? { path: path, route: route, params: params } : { path: path };
  return wrapInCurrentRouteContext(currentRoute, route ?
    route.props.render(params) :
    (otherwise ? otherwise() : null)
  );
}

/**
 * @param {RouteData} currentRoute
 * @param {JSX.Element|null} children
 * @returns {JSX.Element|null}
 */
function wrapInCurrentRouteContext(currentRoute, children) {
  return children ? (
    <CurrentRouteContext.Provider value={currentRoute}>
      {children}
    </CurrentRouteContext.Provider>
  ) : null;
}

/**
 * @typedef RouteProps
 * @property {string} when
 * @property {(routeParams: (Object|null)) => (JSX.Element)} render
 */

/**
 * @typedef {React.ReactElement<RouteProps,Route>} RouteElement
 */

/**
 * @param {RouteProps} props
 * @returns {RouteElement|null}
 */
// eslint-disable-next-line no-unused-vars
export function Route(props) {
  return null;
}

/**
 * @returns {RouteData|null}
 */
export function useCurrentRoute() {
  return useContext(CurrentRouteContext);
}
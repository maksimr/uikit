import React, { Children, createContext, isValidElement, useContext } from 'react';
import { matchPath } from '../url';

const CurrentRouteContext = createContext(/**@type {RouteData|null}*/(null));

/**
 * @typedef RouteData
 * @property {string} path URL path
 * @property {(Object<string,string>|null)} [params]
 * @property {RouteElement} [route]
 */

/**
 * @typedef SwitchProps
 * @property {string} path URL path
 * @property {(function():JSX.Element)|JSX.Element} [otherwise] A fallback route to redirect to, when no route definition matches the current URL
 * @property {RouteElement[] | RouteElement} [children]
 * @param {SwitchProps} props
 * @returns {JSX.Element|null}
 */
export function Switch({ path, otherwise, children }) {
  let route = /**@type {RouteElement | null}*/(null);
  let params = null;
  Children.forEach(children ?? [], (/**@type {RouteElement}*/child) => {
    if (!route && child.type === Route && (params = matchPath(child.props.when, path))) {
      route = child;
    }
  });
  /**@type {RouteData}*/
  const currentRoute = route ? { path: path, route: route, params: params } : { path: path };
  return wrapInCurrentRouteContext(currentRoute, route ?
    route.props.children :
    renderOtherwise()
  );

  function renderOtherwise() {
    if (isValidElement(otherwise)) {
      return otherwise;
    } else if (typeof otherwise === 'function') {
      return otherwise();
    }
    return null;
  }
}

/**
 * @param {RouteData} currentRoute
 * @param {React.ReactNode} children
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
 * @property {string} when Route path
 * @property {(JSX.Element)} children
 */

/**
 * @typedef {React.ReactElement<RouteProps,Route>} RouteElement
 */

/**
 * @param {RouteProps} props
 * @returns {RouteElement|null}
 */
export function Route(props) {
  return props.children;
}

/**
 * @returns {RouteData|null}
 */
export function useCurrentRoute() {
  return useContext(CurrentRouteContext);
}
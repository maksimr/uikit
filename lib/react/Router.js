import React, { Children, createContext, isValidElement, useContext } from 'react';
import { match } from '../path';

const CurrentRouteContext = createContext(/**@type {RouteData|null}*/(null));

/**
 * @typedef RouteData
 * @property {string} path
 * @property {(Object<string,string>|null)} [params]
 * @property {RouteElement} [route]
 */

/**
 * @typedef SwitchProps
 * @property {string} path
 * @property {(function():JSX.Element)|JSX.Element} [otherwise]
 * @property {RouteElement[] | RouteElement} [children]
 * @param {SwitchProps} props
 * @returns {JSX.Element|null}
 */
export function Switch({ path, otherwise, children }) {
  let route = /**@type {RouteElement | null}*/(null);
  let params = null;
  Children.forEach(children ?? [], (/**@type {RouteElement}*/child) => {
    if (!route && child.type === Route && (params = match(child.props.when, path))) {
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
 * @property {string} when
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
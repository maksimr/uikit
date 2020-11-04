/**
 * @param {{path: string, otherwise?: function():JSX.Element, children: (Array<JSX.Element> | JSX.Element)}} props
 * @returns {JSX.Element}
 */
export function Switch({ path, otherwise, children }: {
    path: string;
    otherwise?: () => JSX.Element;
    children: (Array<JSX.Element> | JSX.Element);
}): JSX.Element;
/**
 * @param {{when: string, render: function():JSX.Element}} props
 * @returns {JSX.Element}
 */
export function Route(props: {
    when: string;
    render: () => JSX.Element;
}): JSX.Element;
export function useCurrentRoute(): any;

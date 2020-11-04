/**
 * @typedef { import("./../Store").Store } Store
 */
/**
 * @param {{store: Store, children: JSX.Element}} props
 * @returns {JSX.Element}
 */
export function StoreLayer({ store, children }: {
    store: Store;
    children: JSX.Element;
}): JSX.Element;
/**
 * @param {function(any): any} [fn]
 * @returns {[any, function(function): any]}
 */
export function useStore(fn?: (arg0: any) => any): [any, (arg0: Function) => any];
export type Store = import("../Store").Store;

import React, { createContext, useContext, useEffect, useState } from 'react';
const StoreLayerContext = createContext(null);
/**
 * @typedef { import("./../Store").Store } Store
 */
/**
 * @param {{store: Store, children: JSX.Element}} props
 * @returns {JSX.Element}
 */
export function StoreLayer({ store, children }) {
    return React.createElement(StoreLayerContext.Provider, { value: store }, children);
}
/**
 * @param {function(any): any} [fn]
 * @returns {[any, function(function): any]}
 */
export function useStore(fn) {
    const store = useContext(StoreLayerContext);
    const [value, setValue] = useState(fn ? fn(store.value) : store.value);
    useEffect(() => {
        return store.addListener((state) => {
            setValue(fn ? fn(state) : state);
        });
    }, [store, fn]);
    return [value, store.swap];
}

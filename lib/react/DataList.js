import { forwardRef, useImperativeHandle, useState } from 'react';

/**
 * @typedef DataListValue
 * @property {() => void} open
 * @property {() => void} close
 * @property {(query: unknown) => void} filter
 */

/**
 * @typedef DataListProps
 * @property {React.ReactNode|((data: {query: unknown, target: unknown}) => React.ReactNode)} [children]
 * @property {unknown} [target]
 */

export const DataList = forwardRef(
    /**
     * @param {DataListProps} props 
     * @param {import('react').ForwardedRef<DataListValue>} externalRef
     * @returns {JSX.Element|null}
     */
    ({ children, target }, externalRef) => {
        const [isOpen, setOpen] = useState(false);
        const [query, setQuery] = useState(/**@type {unknown|null}*/(null));
        useImperativeHandle(externalRef, /**@returns {DataListValue}*/() => {
            return {
                open() {
                    setOpen(true);
                },
                close() {
                    setOpen(false);
                    setQuery(null);
                },
                filter(query) {
                    setQuery(query);
                }
            };
        }, []);
        return isOpen ? (
            typeof children === 'function'
                ? children({ target, query })
                : children
        ) : null;
    }
);
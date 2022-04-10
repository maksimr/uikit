import { forwardRef, useImperativeHandle, useState } from 'react';

/**
 * @typedef DataListValue
 * @property {() => void} open
 * @property {() => void} close
 * @property {(query: unknown) => void} filter
 */

/**
 * @typedef DataListProps
 * @property {React.ReactElement|((data: {query: unknown, target: unknown}) => React.ReactElement)} [children]
 * @property {unknown} [target]
 */

export const DataList = forwardRef(
  /**
   * @param {DataListProps} props
   * @param {import('react').ForwardedRef<DataListValue>} externalRef
   * @returns {React.ReactElement}
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
    return /**@type {React.ReactElement}*/(isOpen ? (
      typeof children === 'function'
        ? children({ target, query })
        : children
    ) : null);
  }
);
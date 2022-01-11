import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { addEventListener } from '../consolidated-events';
import { binarySearch } from '../util';

/**
 * @template T
 * @typedef NavigationZoneValue
 * @property {() => boolean} next
 * @property {() => boolean} prev
 * @property {(dx: number) => boolean} move
 * @property {(value: T) => boolean} pick
 * @property {(index: number) => boolean} pickByIndex
 * @property {(navItem: NavigationItemValue<T>) => () => void} register
 * @property {(navItem: NavigationItemValue<T>) => void} deregister
 */

/**
 * @template T
 * @typedef NavigationItemValue
 * @property {HTMLElement} node
 * @property {T} [value]
 * @property {(event: {nativeFocus?: boolean}) => void} focus
 * @property {() => void} blur
 */

const NavigationZoneContext = createContext(
  /**
   * @type {NavigationZoneValue<any> | null}
   */
  (null)
);

export const NavigationZone = forwardRef(
  /**
   * @typedef NavigationZoneProps
   * @property {boolean} [nativeFocus] Fire focus event on DOM element
   * @property {boolean} [disabled]
   * @property {React.ReactNode} [children]
   */
  /**
   * @template T
   * @param {NavigationZoneProps} props
   * @param {import('react').ForwardedRef<NavigationZoneValue<T>>} externalRef
   * @returns {JSX.Element}
   */
  function NavigationZone(
    { children, nativeFocus = true, disabled = false },
    externalRef
  ) {
    const nodeRef = useRef(/**@type {HTMLDivElement|null}*/(null));
    const refData = useRef({
      current: /**@type {NavigationItemValue<T>|null}*/(null),
      items: /**@type {NavigationItemValue<T>[]}*/([]),
      disabled,
      nativeFocus
    });
    refData.current.disabled = disabled;
    refData.current.nativeFocus = nativeFocus;
    /**@type {NavigationZoneValue<T>}*/
    const zone = useMemo(() => {
      return {
        prev() {
          return this.move(-1);
        },
        next() {
          return this.move(1);
        },
        move(dx) {
          const current = refData.current.current;
          const prevIndex = current !== null ? refData.current.items.indexOf(
            current
          ) : -1;
          const index = prevIndex + dx;
          return this.pickByIndex(index);
        },
        pick(value) {
          const index = refData.current.items.findIndex(
            (item) => item.value === value
          );
          return this.pickByIndex(index);
        },
        pickByIndex(index) {
          if (refData.current.disabled) {
            return false;
          }

          const items = refData.current.items;
          const nativeFocus = refData.current.nativeFocus;
          const max = items.length - 1;
          const prevIndex = refData.current.current !== null ?
            items.indexOf(refData.current.current) : -1;
          index = Math.max(Math.min(index, max), 0);
          if (prevIndex !== index) {
            refData.current.current = index < 0 ? null : items[index];
            items[prevIndex]?.blur();
            items[index]?.focus({ nativeFocus });
          }
          return true;
        },
        register(newItem) {
          if (!newItem.node) {
            throw Error('NavigationZone: property `node` is required');
          }
          const index = ~binarySearch(refData.current.items, (item) => {
            return item.node.compareDocumentPosition(newItem.node) &
              Node.DOCUMENT_POSITION_FOLLOWING
              ? 1
              : -1;
          });
          refData.current.items.splice(index, 0, newItem);
          return () => this.deregister(newItem);
        },
        deregister(item) {
          const idx = refData.current.items.indexOf(item);
          if (idx > -1) {
            refData.current.items.splice(idx, 1);
            if (refData.current.current === item) {
              refData.current.current = null;
            }
          }
        }
      };
    }, []);

    useEffect(() => {
      return addEventListener(document, 'keypress', (event) => {
        const kbdEvent = /**@type {KeyboardEvent}*/(event);
        const target = /**@type {Node}*/(kbdEvent.target);
        if (
          !target ||
          refData.current.disabled ||
          !nodeRef.current?.contains?.(target)
        ) {
          return false;
        }

        const key = kbdEvent.key;
        if (key === 'ArrowUp') {
          zone.prev();
        } else if (key === 'ArrowDown') {
          zone.next();
        }
      });
    }, [zone]);

    useImperativeHandle(externalRef, () => zone);

    return (
      <div ref={nodeRef} tabIndex={0}>
        <NavigationZoneContext.Provider value={zone}>
          {children}
        </NavigationZoneContext.Provider>
      </div>
    );
  }
);

/**
 * @template T
 * @typedef NavigationItemProps
 * @property {T} [value]
 * @property {(target: {target: {value: T | undefined}}) => void} [onFocus]
 * @property {(target: {target: {value: T | undefined}}) => void} [onBlur]
 * @property {React.ReactNode} [children]
 */
/**
 * @template T
 * @param {NavigationItemProps<T>} props
 * @returns {JSX.Element}
 */
export function NavigationItem({ children, value, onFocus, onBlur }) {
  /**@type {NavigationZoneValue<T>|null}*/
  const navZone = useContext(NavigationZoneContext);
  const refNode = useRef(/**@type {HTMLDivElement|null}*/(null));
  const ref = useRef({ onFocus, onBlur });
  ref.current.onFocus = onFocus;
  ref.current.onBlur = onBlur;

  useEffect(() => {
    return navZone?.register(/**@type {NavigationItemValue<T>}*/({
      node: refNode.current,
      value: value,
      focus({ nativeFocus }) {
        if (nativeFocus) {
          refNode.current?.focus();
        }
        ref.current.onFocus?.({ target: { value } });
      },
      blur() {
        ref.current.onBlur?.({ target: { value } });
      }
    }));
  }, [navZone, ref, value]);

  return (
    <div ref={refNode} tabIndex={0}>
      {children}
    </div>
  );
}

/**
 * @template T
 * @param {import('react').MutableRefObject<NavigationZoneValue<T>|null>} navZoneRef 
 * @returns {(event: KeyboardEvent) => void}
 */
export function useNavigationZone(navZoneRef) {
  return useCallback(
    (event) => {
      if (!navZoneRef.current) {
        return;
      }
      const key = event.key;
      const direction = key === 'ArrowDown' ? 1 : (key === 'ArrowUp' ? -1 : 0);
      if (direction && navZoneRef.current.move(direction)) {
        event.preventDefault();
      }
    },
    [navZoneRef.current]
  );
}
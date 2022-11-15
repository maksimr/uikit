import { useCallback, useEffect, useRef } from 'react';
import { shallowEqual } from './shallowEqual';

/**
  * @template {Element} T
  * @param {(entry: ResizeObserverEntry) => void} fn
  * @param {ResizeObserverOptions} [options]
  * @returns {import('react').RefCallback<T>}
  */
export function useResizeObserver(fn, options) {
  const ref = useRef({
    element: /**@type {Element|null}*/(null),
    timerId: /**@type {number|null}*/(null),
    resizeObserver: /**@type {ResizeObserver|null}*/(null),
    callback: fn,
    options: options
  });

  ref.current.callback = fn;
  options = shallowEqual(ref.current.options, options) ?
    ref.current.options :
    options;

  const cleanup = useCallback(() => {
    ref.current.timerId && cancelAnimationFrame(ref.current.timerId);
    if (ref.current.element && ref.current.resizeObserver) {
      ref.current.resizeObserver.unobserve(ref.current.element);
    }
    ref.current.timerId = null;
    ref.current.resizeObserver = null;
    ref.current.element = null;
  }, []);

  const observe = useCallback(
    (/**@type {Element|null}*/element, /**@type {ResizeObserverOptions | undefined}*/options) => {
      if (
        ref.current.element === element &&
        ref.current.options === options
      ) {
        return;
      }
      cleanup();
      ref.current.element = element;
      ref.current.options = options;
      if (!element) return;
      const resizeObserver = new ResizeObserver((entries) => {
        ref.current.timerId && cancelAnimationFrame(ref.current.timerId);
        // Use requestAnimationFrame to prevent "ResizeObserver loop limit exceeded" error
        ref.current.timerId = requestAnimationFrame(() => {
          if (ref.current.callback) {
            const entry = entries[0];
            ref.current.callback(entry);
          }
        });
      });
      resizeObserver.observe(element, options);
      ref.current.resizeObserver = resizeObserver;
    },
    [cleanup]
  );

  useEffect(() => cleanup, [cleanup]);
  return useCallback((element) => observe(element, options), [observe, options]);
}
import { useState, useCallback } from "react";

/**
 * @template T
 * @param {T} initialState
 * @returns {[T, function((T|function(T):T),function=):any]}
 */
export function useStateWithCallback(initialState) {
  const [state, setState] = useState(initialState);
  const setStateWithCallback = useCallback(
    /**
     * @param {(T|function(T):T)} value
     * @param {function=} callback
     */
    (value, callback) => {
      if (!callback) {
        setState(value);
        return;
      }

      setState((prevState) => {
        const result = (value instanceof Function) ? value(prevState) : value;
        if (result !== prevState) {
          callback(result);
        }
        return result;
      });
    }
    , [setState]);

  return [state, setStateWithCallback];
}
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * @template T
 * @param {T} initialState
 * @returns {[T, function((T|function(T):T),function=):any]}
 */
export function useStateWithCallback(initialState) {
  const [state, setState] = useState(initialState);
  const [flipFlop, setFlipFlop] = useState(true);
  const queue = useRef(/**@type {function[]}*/([]));
  const setStateWithCallback = useCallback((newState, callback) => {
    setState(newState);
    if (callback) {
      queue.current.push(callback);
    }
    if (queue.current.length === 1) {
      setFlipFlop(!flipFlop);
    }
  }, [setState, queue]);

  useEffect(() => {
    const currentQueue = queue.current;
    if (currentQueue.length) {
      while (currentQueue.length) {
        currentQueue.shift()?.();
      }
    }
  }, [flipFlop]);

  return [state, setStateWithCallback];
}
import { useState, useEffect, useRef, useCallback } from "react";
/**
 * @template T
 * @param {T} initialState
 * @returns {[T, function((T|function(T):T),function=):any]}
 */
export function useStateWithCallback(initialState) {
    const [state, setState] = useState(initialState);
    const queue = useRef([]);
    const setStateWithCallback = useCallback((newState, callback) => {
        setState(newState);
        queue.current.push(callback);
    }, [setState, queue]);
    useEffect(() => {
        const currentQueue = queue.current;
        if (currentQueue.length) {
            while (currentQueue.length) {
                currentQueue.shift()();
            }
        }
    }, [state]);
    return [state, setStateWithCallback];
}

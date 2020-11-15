/**
 * @template T
 * @param {T} initialState
 * @returns {[T, function((T|function(T):T),function=):any]}
 */
export function useStateWithCallback<T>(initialState: T): [T, (arg0: T | ((arg0: T) => T), arg1?: Function | undefined) => any];

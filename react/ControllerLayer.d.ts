export function ControllerLayer({ value, type, children }: {
    value: any;
    type?: any;
    children: any;
}): JSX.Element;
/**
 * @template T
 * @param {{new(...args: any[]): T}} type
 * @returns {T}
 */
export function useController<T>(type: new (...args: any[]) => T): T;

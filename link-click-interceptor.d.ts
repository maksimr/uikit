/**
 * @typedef LinkClickInterceptorOptions
 * @property {HTMLElement} [rootNode]
 * @property {string} [baseUrl]
 */
/**
 * @param {function(HTMLAnchorElement, Event):(boolean|void)} handler
 * @param {LinkClickInterceptorOptions} [options]
 * @returns {function(): void}
 */
export function addLinkClickInterceptor(handler: (arg0: HTMLAnchorElement, arg1: Event) => (boolean | void), { rootNode, baseUrl }?: LinkClickInterceptorOptions): () => void;
export type LinkClickInterceptorOptions = {
    rootNode?: HTMLElement;
    baseUrl?: string;
};

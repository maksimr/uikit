export class Store {
    constructor(initValue: any, reducer: any);
    value: any;
    reducer: any;
    listeners: any[];
    swap(fn: any, ...args: any[]): any;
    addListener(listener: any): () => void;
}

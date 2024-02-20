class BatchCancelError extends Error {
  constructor() {
    super('Batch cancelled');
    this.name = 'BatchCancelError';
  }
}

/**
 * Creates a batch function that groups multiple function calls and executes them together.
 * @template {any[]} A - The type of the arguments array.
 * @template R - The type of the return value(s) of the function.
 * @param {(args: A[]) => (R[] | Promise<R[]>)} fn - The function to be batched.
 * @param {object} [options] - The options for the batch function.
 * @param {number} [options.maxBatchTime] - The maximum time (in milliseconds) to wait before executing the batch.
 * @param {number} [options.maxBatchSize] - The maximum number of function calls to batch together.
 * @returns {((...args: A) => Promise<R>) & {cancel: () => void; flush: () => Promise<void>;}} - The batched function.
 */
export function batch(fn, {
  maxBatchTime: timeout = 10,
  maxBatchSize: size = 1000
} = {}) {
  /**@type {NodeJS.Timeout | null}*/
  let timerId = null;
  /**@type {ReturnType<typeof createDeferred<R[]>> | null}*/
  let deferred = null;
  /**@type {A[]}*/
  const batchArgs = [];
  const batchedFn = (/**@type {A}*/...args) => {
    const callIndex = batchArgs.length;
    batchArgs.push(args);

    if (deferred === null) {
      deferred = createDeferred();
      timerId = setTimeout(callFn, timeout);
    }

    const callResult = deferred.promise.then(results => {
      return results[callIndex];
    });

    if (batchArgs.length >= size) {
      callFn();
    }

    return callResult;
  };

  batchedFn.cancel = cancelFn;
  batchedFn.flush = callFn;

  return batchedFn;

  function callFn() {
    clearTimer();
    if (deferred === null) return Promise.resolve([]);

    let localDeferred = deferred;
    deferred = null;
    try {
      const args = batchArgs.slice();
      batchArgs.length = 0;
      localDeferred.resolve(fn(args));
    } catch (error) {
      localDeferred.reject(error);
    }
    return localDeferred.promise;
  }

  function cancelFn() {
    clearTimer();
    if (deferred === null) return;

    let localDeferred = deferred;
    deferred = null;
    localDeferred.reject(new BatchCancelError());
  }

  function clearTimer() {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  /**
   * @template T
   */
  function createDeferred() {
    /**@type {((value: T | Promise<T>) => void)}*/
    let resolve;
    /**@type {((reason?: any) => void)}*/
    let reject;
    const promise = new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
    // @ts-ignore
    return { promise, resolve: resolve, reject: reject };
  }
}

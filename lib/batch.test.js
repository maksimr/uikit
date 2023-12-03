import { advanceTimersByTime, createSpy, setSystemTime, useFakeTimers } from '../test/test-util';
import { batch } from './batch';

describe('batch', function() {
  const maxBatchTime = 5/*ms*/;
  const maxBatchSize = 3;
  /**@type {(args: number[][])=>number[]}*/
  let fn;

  beforeEach(function() {
    useFakeTimers();
    setSystemTime(0);
    fn = createSpy((/**@type {number[][]}*/args) => {
      return args.map(([x]) => x * 2);
    });
  });

  it('should batch calls within the specified time', async function() {
    const bfn = batch(fn, { maxBatchTime });
    const promise = Promise.all([
      bfn(1),
      bfn(2),
      bfn(3)
    ]);

    advanceTimersByTime(maxBatchTime - 1); // Wait for less than maxBatchTime

    expect(fn).not.toHaveBeenCalled(); // Function should not have been called yet

    advanceTimersByTime(1); // Wait for the remaining time

    const result = await promise;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith([[1], [2], [3]]);
    expect(result).toEqual([2, 4, 6]);
  });

  it('should batch calls when the batch size is reached', async function() {
    const bfn = batch(fn, { maxBatchSize });
    const promise = Promise.all([
      bfn(1),
      bfn(2),
      bfn(3)
    ]);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith([[1], [2], [3]]);
    const result = await promise;
    expect(result).toEqual([2, 4, 6]);
  });

  it('should cancel the batch when cancel is called', async function() {
    const bfn = batch(fn, { maxBatchTime });
    const onCancel = createSpy();
    const promise = Promise.all([
      bfn(1),
      bfn(2),
      bfn(3)
    ]);

    advanceTimersByTime(maxBatchTime - 1); // Wait for less than maxBatchTime

    bfn.cancel();

    advanceTimersByTime(1); // Wait for the remaining time

    await promise.catch(onCancel);

    expect(onCancel).toHaveBeenCalledWith(new Error('Batch cancelled'));
    expect(fn).not.toHaveBeenCalled();
  });

  it('should flush the batch when flush is called', async function() {
    const bfn = batch(fn, { maxBatchTime });
    const promise = Promise.all([
      bfn(1),
      bfn(2),
      bfn(3)
    ]);

    bfn.flush();

    const result = await promise;
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith([[1], [2], [3]]);
    expect(result).toEqual([2, 4, 6]);
  });
});
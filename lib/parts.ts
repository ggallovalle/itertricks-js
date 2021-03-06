import { isNumber } from "./internal/is";
import { curry2, curry3 } from "./internal/functools";
import { Predicate } from "./internal/types";

type Take = {
  (n: number): <T>(source: Iterable<T>) => Generator<T>;
  <T>(source: Iterable<T>, n: number): Generator<T>;
};

/**
 * Take the first `n` elements out of iterable.
 *
 * @category parts
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param source
 * @param n
 */
export const take: Take = curry2(function* (source: any, n: any) {
  let counter = 0;
  for (const element of source) {
    if (counter === n) {
      break;
    }
    yield element;
    counter++;
  }
});

type TakeWhile = {
  <T>(predicate: Predicate<T>): (source: Iterable<T>) => Generator<T>;
  <T>(source: Iterable<T>, predicate: Predicate<T>): Generator<T>;
};

/**
 * Take the first elements which satisfy the predicate.
 *
 * @category parts
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param source
 * @param predicate
 */
export const takeWhile: TakeWhile = curry2(function* (
  source: any,
  predicate: any
) {
  for (const element of source) {
    if (!predicate(element)) {
      break;
    }
    yield element;
  }
});

/**
 * Drop the first `n` elements.
 *
 * @category parts
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param source
 * @param n
 */
export const drop: Take = curry2(function* (source: any, n: any) {
  let counter = 0;
  for (const element of source) {
    counter++;
    if (counter <= n) {
      continue;
    }
    yield element;
  }
});

/**
 * Drop elements until the predicate is not satisfied.
 *
 * @category parts
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param source
 * @param predicate
 */
export const dropWhile: TakeWhile = curry2(function* (
  source: any,
  predicate: any
) {
  let keepDropping = true;
  for (const element of source) {
    if (keepDropping) {
      if (!predicate(element)) {
        keepDropping = false;
        yield element;
      }
      continue;
    }
    yield element;
  }
});

type Chunked = {
  (size: number): <T>(source: Iterable<T>) => Generator<T[]>;
  <T>(source: Iterable<T>, size: number): Generator<T[]>;
};

/**
 * Splits the `source` into an array of arrays, each not exceeding the given `size`.
 *
 * @category parts
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param source
 * @param size - the number of elements to take in each list.
 * @throws {RangeError} - when `size` <= 0
 */
export const chunked: Chunked = curry2(function* (source: any, size: any) {
  if (size <= 0) throw new RangeError(`size MUST be >= 0`);
  let counter = 0;
  let accumulator = [];
  for (const element of source) {
    counter++;
    accumulator.push(element);
    if (counter !== size) {
      continue;
    }
    yield accumulator;
    // reset
    counter = 0;
    accumulator = [];
  }
  if (accumulator.length !== 0) yield accumulator;
});

type Windowed = {
  (size: number, options?: { step?: number; partialWindow?: boolean }): <T>(
    source: Iterable<T>
  ) => Generator<T[]>;
  <T>(
    source: Iterable<T>,
    size: number,
    options?: { step?: number; partialWindow?: boolean }
  ): Generator<T[]>;
};

const _windowedDefaultOptions = {
  step: 1,
  partialWindow: false,
};

/**
 * Returns an iterable of snapshots of the window of the given `size` sliding
 * along the `source` with the given `opts.step`, where each snapshot is an array.
 *
 * @category parts
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param source
 * @param size - the number of elements to take in each window.
 * @param options?
 * @param [options?.partialWindow=false] - controls weather or not to keep partial window.
 * @param [options?.step=1] - the number of elements to move the window forward by on each step.
 */
export const windowed: Windowed = curry3(
  isNumber,
  function* (source: any, size: any, options: any) {
    let counter = 0;
    let accumulator = [];

    options = { ..._windowedDefaultOptions, ...options };

    for (const element of source) {
      counter++;
      accumulator.push(element);
      if (counter !== size) {
        continue;
      }
      yield accumulator;
      // reset based on step
      counter = counter - (options.step ?? 0);
      accumulator = accumulator.slice(options.step);
    }
    if (options.partialWindow) yield accumulator;
  }
);

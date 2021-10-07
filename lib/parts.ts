import { isIterable, isNumber } from "./internal/is";
import { Partitioned, Predicate } from "./internal/types";
import { curry2, curry3 } from "./internal/functools";

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
    counter++;
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
    if (counter == size) {
      yield accumulator;
      counter = 0;
      accumulator = [];
    }
  }
  if (accumulator.length !== 0) yield accumulator;
});

const _windowedDefaultOptions = {
  step: 1,
  partialWindow: false,
};

type Windowed = {
  (size: number, options?: { step?: number; partialWindow?: boolean }): <T>(
    source: Iterable<T>
  ) => Generator<T>;
  <T>(
    source: Iterable<T>,
    size: number,
    options?: { step?: number; partialWindow?: boolean }
  ): Generator<T[]>;
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
      if (counter === size) {
        yield accumulator;
        counter = counter - (options.step ?? 0);
        accumulator = accumulator.slice(options.step);
      }
    }
    if (options.partialWindow) yield accumulator;
  }
);

/**
 * Split the `source` based on the `predicate`. The matches would be located at the `right`,
 * the ones that did not matched will be located at the `left`.
 * @category parts
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param predicate
 */
export function partition<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => Partitioned<T, T>;
export function partition<T>(
  source: Iterable<T>,
  predicate: Predicate<T>
): Partitioned<T, T>;
export function partition(x: any, y?: any): any {
  return;
}

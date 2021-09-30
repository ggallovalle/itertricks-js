/**
 * Take the first `n` elements out of iterable.
 *
 * @category parts
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param n
 */
import { isIterable } from "./internal/is";

export function take(n: number): <T>(source: Iterable<T>) => Generator<T>;
/**
 * Take the first `n` elements out of iterable.
 *
 * @category parts
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param n
 * @param source
 */
export function take<T>(n: number, source: Iterable<T>): Generator<T>;
export function take<T>(n: number, source?: Iterable<T>): any {
  let counter = 0;
  const logic = function* (s: Iterable<T>) {
    for (const x of s) {
      counter++;
      yield x;
      if (counter === n) {
        break;
      }
    }
  };
  if (source != null) {
    return logic(source);
  } else {
    return logic;
  }
}

/**
 * Splits the `source` into an array of arrays, each not exceeding the given `size`.
 *
 * @category parts
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param size - the number of elements to take in each list.
 * @throws {RangeError} - when `size` <= 0
 */
export function chunked(
  size: number
): <T>(source: Iterable<T>) => Generator<T[]>;
/**
 * Splits the `source` into an array of arrays, each not exceeding the given `size`.
 *
 * @category parts
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param size - the number of elements to take in each list.
 * @param source
 * @throws {RangeError} - when `size` <= 0
 */
export function chunked<T>(size: number, source: Iterable<T>): Generator<T[]>;
export function chunked<T>(size: number, source?: Iterable<T>): any {
  if (size <= 0) throw new RangeError("`size` MUST be >= 0");
  let counter = 0;
  let accumulator: T[] = [];
  const logic = function* (s: Iterable<T>) {
    for (const x of s) {
      counter++;
      accumulator.push(x);
      if (counter == size) {
        yield accumulator;
        counter = 0;
        accumulator = [];
      }
    }
    if (accumulator.length !== 0) yield accumulator;
  };
  if (source != null) {
    return logic(source);
    // curried version
  } else {
    return logic;
  }
}

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
 * @param size - the number of elements to take in each window.
 * @param options
 * @param [options.step=1] - the number of elements to move the window forward by on each step.
 * @param [options.partialWindow=false] - controls weather or not to keep partial window.
 */
export function windowed(
  size: number,
  options?: { step?: number; partialWindow?: boolean }
): <T>(source: Iterable<T>) => Generator<T>;
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
 * @param size - the number of elements to take in each window.
 * @param source
 * @param options
 * @param [options.step=1] - the number of elements to move the window forward by on each step.
 * @param [options.partialWindow=false] - controls weather or not to keep partial window.
 */
export function windowed<T>(
  size: number,
  source: Iterable<T>,
  options?: { step?: number; partialWindow?: boolean }
): Generator<T[]>;
export function windowed<T>(size: number, source?: any, options?: any): any {
  if (isIterable(source)) {
    options = { ..._windowedDefaultOptions, ...options };
  } else {
    options = { ..._windowedDefaultOptions, ...source };
  }
  const logic = function* (s: Iterable<T>) {
    let counter = 0;
    let accumulator: T[] = [];

    for (const x of s) {
      counter++;
      accumulator.push(x);
      if (counter === size) {
        yield accumulator;
        counter = counter - (options.step ?? 0);
        accumulator = accumulator.slice(options.step);
      }
    }
    if (options.partialWindow) yield accumulator;
  };
  if (isIterable(source)) {
    return logic(source);
  } else {
    return logic;
  }
}

import { isIterable } from "./internal/is";

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
 * @param source
 * @param n
 */
export function take<T>(source: Iterable<T>, n: number): Generator<T>;
export function take<T>(x: any, y?: any): any {
  let n: number;
  let source: Iterable<T> | null = null;
  if (isIterable(x)) {
    source = x;
    n = y;
  } else {
    n = x;
  }
  let counter = 0;
  const logic = function* (s: Iterable<T>) {
    for (const element of s) {
      counter++;
      yield element;
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
 * @param source
 * @param size - the number of elements to take in each list.
 * @throws {RangeError} - when `size` <= 0
 */
export function chunked<T>(source: Iterable<T>, size: number): Generator<T[]>;
export function chunked<T>(x: any, y?: any): any {
  let size: number;
  let source: Iterable<T> | null = null;
  if (isIterable(x)) {
    source = x;
    size = y;
  } else {
    size = x;
  }
  if (size <= 0) throw new RangeError("`size` MUST be >= 0");
  let counter = 0;
  let accumulator: T[] = [];
  const logic = function* (s: Iterable<T>) {
    for (const element of s) {
      counter++;
      accumulator.push(element);
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
 * @param source
 * @param size - the number of elements to take in each window.
 * @param options?
 * @param [options?.partialWindow=false] - controls weather or not to keep partial window.
 * @param [options?.step=1] - the number of elements to move the window forward by on each step.
 */
export function windowed<T>(
  source: Iterable<T>,
  size: number,
  options?: { step?: number; partialWindow?: boolean }
): Generator<T[]>;
export function windowed<T>(x: any, y?: any, options?: any): any {
  let size: number;
  let source: Iterable<T> | null = null;
  if (isIterable(x)) {
    source = x;
    size = y;
    options = { ..._windowedDefaultOptions, ...options };
  } else {
    size = x;
    options = { ..._windowedDefaultOptions, ...y };
  }
  const logic = function* (s: Iterable<T>) {
    let counter = 0;
    let accumulator: T[] = [];

    for (const element of s) {
      counter++;
      accumulator.push(element);
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

import { InfiniteLoopError } from "./internal/errors";

/**
 * Returns a Generator defined by the starting value `seed` and the function `f` which
 *is invoked to calculate the next value based on the previous one on each iteration.
 *
 * When `f` returns null, the iteration is finite, otherwise is infinite. Or not or yes.
 *
 * @category constructor
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param initial
 * @param f
 */
export function* newGenerator<T>(
  initial: T,
  f: (a: T) => T | null
): Generator<T> {
  let previous: T | null = initial;
  while (previous != null) {
    yield previous;
    previous = f(previous);
  }
}

/**
 * Starting from `0` until `stop`.
 *
 * @category constructor
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param stop
 */
export function range(stop: number): Generator<number>;
/**
 * Starting from `start` until `stop`, with `step`.
 *
 * @category constructor
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param start
 * @param stop
 * @param [step=1] - the value of step parameter.
 * @throws {InfiniteLoopError} - when ranges are mal formed.
 */
export function range(
  start: number,
  stop: number,
  step?: number
): Generator<number>;
export function* range(
  start: number,
  stop?: number,
  step: number = 1
): Generator<number> {
  if (stop == null) {
    stop = start;
    start = 0;
  }
  // hottest (aka most frequent) path
  if (step > 0) {
    if (start > stop)
      throw new InfiniteLoopError("`start` > `stop` in incrementing counter");
    for (let index = start; index <= stop; index += step) {
      yield index;
    }
  } else if (step < 0) {
    if (start < stop)
      throw new InfiniteLoopError("`start` < `stop` in decrementing counter");
    for (let index = start; index >= stop; index += step) {
      yield index;
    }
  } else {
    throw new InfiniteLoopError(
      "With a `step=0` you will have an infinite loop"
    );
  }
}

/**
 * Count infinitely from `start` with evenly spaced `step`.
 *
 * @category constructor
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param [start=0]
 * @param [step=1]
 */
export function* count(start: number = 0, step: number = 1): Generator<number> {
  let counter = start;
  while (true) {
    yield counter;
    counter += step;
  }
}

export function* cycle<T>(source: Iterable<T>): Generator<T> {
  const saved = [];
  for (const element of source) {
    yield element;
    saved.push(element);
  }

  while (saved.length > 0) {
    for (const element of saved) {
      yield element;
    }
  }
}

export function* repeat<T>(value: T): Generator<T> {
  while (true) {
    yield value;
  }
}

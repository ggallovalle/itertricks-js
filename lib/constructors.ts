import { InfiniteLoopError } from "./internal/errors";

/**
 * Returns a Generator defined by the starting value `initial` and the function `f` which
 *is invoked to calculate the next value based on the previous one on each iteration.
 *
 * When `f` returns null, the iteration ends, otherwise is infinite loop.
 *
 * @category constructors
 * @public
 * @since 1.0.0
 * @version 1.0.0
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
 * @category constructors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param stop
 * @throws {InfiniteLoopError} - when ranges are mal formed.
 */
export function range(stop: number): Generator<number>;
/**
 * Starting from `start` until `stop`, with `step`.
 *
 * @category constructors
 * @public
 * @since 1.0.0
 * @version 1.0.0
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
  if (step === 0) {
    throw new InfiniteLoopError(
      "When step is 0 then you will have an infinite loop."
    );
  }
  if (stop == null) {
    stop = start;
    start = 0;
  }
  // hottest (aka most frequent) path
  if (step > 0 && start < stop) {
    for (let index = start; index <= stop; index += step) {
      yield index;
    }
  } else if (step < 0 && start > stop) {
    for (let index = start; index >= stop; index += step) {
      yield index;
    }
  } else {
    throw new InfiniteLoopError("Bad range");
  }
}

/**
 * Count infinitely from `start` with evenly spaced `step`.
 *
 * @category constructors
 * @public
 * @since 1.0.0
 * @version 1.0.0
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

/**
 * When the end of the `source` is reached, start again from the beginning, creating an
 * infinite loop. Watch out for the size of the source, because it is kept in memory to
 * be able to cycle through it.
 * @category constructors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 */
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

/**
 * Repeat `value` infinitely .
 * @category constructors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param value
 */
export function* repeat<T>(value: T): Generator<T> {
  while (true) {
    yield value;
  }
}

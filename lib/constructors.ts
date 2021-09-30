import { InfiniteLoopError } from "./internal/errors";

/**
 * Returns a Generator defined by the starting value `seed`.
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param seed
 * @param f
 */
export function* newGenerator<T>(
  seed: T,
  f: (a: T) => T | null
): Generator<T, any, undefined> {
  let previous: T | null = seed;
  while (previous != null) {
    yield previous;
    previous = f(previous);
  }
}

/**
 * Starting from `0` until `stop`.
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
export function* range(start: number, stop?: number, step: number = 1) {
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

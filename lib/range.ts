import { InfiniteLoopError } from "./internal/errors";

/**
 * Starting from `0` until `stop` including it.
 * @param stop
 */
export function range(stop: number): Generator<number>;
/**
 * Starting from `start` until `stop` including it, with step `step`.
 * @param start
 * @param stop
 * @param step the value of step parameter, defaults to 1.
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
  if (step > 0) {
    if (start > stop)
      throw new InfiniteLoopError("`start` > `stop` in incrementing counter");

    // hottest (aka most frequent) path
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

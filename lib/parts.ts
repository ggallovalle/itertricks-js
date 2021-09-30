/**
 * Take the first `n` elements out of iterable.
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param n
 * @param source
 */
export function* take<T>(n: number, source: Iterable<T>): Generator<T> {
  let counter = 0;
  for (const x of source) {
    counter++;
    yield x;
    if (counter === n) {
      break;
    }
  }
}

/**
 * Splits the `source` into an array of arrays, each not exiding the given `size`.
 *
 * @public
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param size - the number of elements to take in each list.
 * @param source
 * @throws {RangeError} - when `size` <= 0
 */
export function* chunked<T>(size: number, source: Iterable<T>): Generator<T[]> {
  if (size <= 0) throw new RangeError("`size` MUST be >= 0");
  let counter = 0;
  let accumulator: T[] = [];
  for (const x of source) {
    counter++;
    accumulator.push(x);
    if (counter == size) {
      yield accumulator;
      counter = 0;
      accumulator = [];
    }
  }
  if (accumulator.length !== 0) yield accumulator;
}

const _windowedDefaultOptions = {
  step: 1,
  partialWindow: false,
};
/**
 *
 * Returns an iterable of snapshots of the window of the given `size` sliding
 * along the `source` with the given `opts.step`, where each snapshot is an array.
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
export function* windowed<T>(
  size: number,
  source: Iterable<T>,
  options?: { step?: number; partialWindow?: boolean }
): Generator<T[]> {
  options = { ..._windowedDefaultOptions, ...options };

  let counter = 0;
  let accumulator: T[] = [];
  for (const x of source) {
    counter++;
    accumulator.push(x);
    if (counter === size) {
      yield accumulator;
      counter = counter - (options.step ?? 0);
      accumulator = accumulator.slice(options.step);
    }
  }
  if (options.partialWindow) yield accumulator;
}

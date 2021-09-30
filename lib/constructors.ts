/**
 * Create an iterator which invokes a function `f` to calculate the next value
 * on each iteration until the function returns null.
 *
 * @param seed
 * @param f
 */
export function* newIterator<T>(
  seed: T,
  f: (a: T) => T | null
): Generator<T, any, undefined> {
  let previous: T | null = seed;
  while (previous != null) {
    yield previous;
    previous = f(previous);
  }
}

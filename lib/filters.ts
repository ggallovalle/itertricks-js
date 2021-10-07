import { Predicate } from "./internal/types";
import { isIterable } from "./internal/is";

/**
 * Create a new iterable with the elements from `source` that matches the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param predicate
 */
export function filter<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => Generator<T>;
/**
 * Create a new iterable with the elements from `source` that matches the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param predicate
 */
export function filter<T>(
  source: Iterable<T>,
  predicate: Predicate<T>
): Generator<T>;
export function filter(x: unknown, y?: unknown): unknown {
  let predicate: Predicate<unknown>;
  if (isIterable(x)) {
    predicate = y as Predicate<unknown>;
  } else {
    predicate = x as Predicate<unknown>;
  }

  function* logic(source: Iterable<unknown>) {
    for (const sourceElement of source) {
      if (predicate(sourceElement)) {
        yield sourceElement;
      }
    }
  }

  if (isIterable(x)) {
    return logic(x);
  } else {
    return logic;
  }
}

/**
 * Create a new iterable with the elements from `source` that does not matches the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param predicate
 */
export function filterNot<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => Generator<T>;
/**
 * Create a new iterable with the elements from `source` that does not matches the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param predicate
 */
export function filterNot<T>(
  source: Iterable<T>,
  predicate: Predicate<T>
): Generator<T>;
export function filterNot(x: unknown, y?: unknown): unknown {
  let predicate: Predicate<unknown>;
  if (isIterable(x)) {
    predicate = y as Predicate<unknown>;
  } else {
    predicate = x as Predicate<unknown>;
  }

  function* logic(source: Iterable<unknown>) {
    for (const sourceElement of source) {
      if (!predicate(sourceElement)) {
        yield sourceElement;
      }
    }
  }

  if (isIterable(x)) {
    return logic(x);
  } else {
    return logic;
  }
}

/**
 * Test if some of the elements matches the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param predicate
 */
export function some<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => boolean;
/**
 * Test if some of the elements matches the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param predicate
 */
export function some<T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
export function some(x: unknown, y?: unknown): unknown {
  return;
}

/**
 * Test if all the elements matches the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param predicate
 */
export function all<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => boolean;
/**
 * Test if all the elements matches the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param predicate
 */
export function all<T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
export function all(x: unknown, y?: unknown): unknown {
  return;
}

/**
 * Test if none of the elements matches the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param predicate
 */
export function none<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => boolean;
/**
 * Test if none the elements matches the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param predicate
 */
export function none<T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
export function none(x: unknown, y?: unknown): unknown {
  return;
}

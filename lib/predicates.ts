import { curry2, curry3 } from "./internal/functools";
import { Predicate } from "./internal/types";
import { isNumber } from "./internal/is";

type AtLeast = {
  <T>(n: number, predicate: Predicate<T>): (source: Iterable<T>) => boolean;
  <T>(source: Iterable<T>, n: number, predicate: Predicate<T>): boolean;
};

/**
 * Returns true at least `n` elements matches the predicate.
 *
 * @category predicates
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param n
 * @param predicate
 */
export const moreThan: AtLeast = curry3(
  isNumber,
  (source: any, n?: any, predicate?: any): any => {
    let counter = 0;
    for (const element of source) {
      if (predicate(element)) {
        counter++;
        if (counter === n) {
          break;
        }
      }
    }
    return counter === n;
  }
);

/**
 * Returns true if less than `n` elements matches the predicate.
 *
 * @category predicates
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param n
 * @param predicate
 */
export const lessThan: AtLeast = curry3(
  isNumber,
  (source: any, n?: any, predicate?: any): any => {
    let counter = 0;
    for (const element of source) {
      if (predicate(element)) {
        counter++;
        if (counter > n) {
          break;
        }
      }
    }
    return counter < n;
  }
);

/**
 * Returns true if source is empty.
 *
 * @category predicates
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 */
export function empty<T>(source: Iterable<T>): boolean {
  let counter = 0;
  for (const element of source) {
    if (counter > 0) {
      break;
    }
    counter++;
  }
  return counter === 0;
}

type Some = {
  <T>(predicate: Predicate<T>): (source: Iterable<T>) => boolean;
  <T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
};

/**
 * Returns true if at least one element matches the predicate.
 *
 * @category predicates
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param predicate
 */
export const some: Some = curry2((source: any, predicate?: any): any => {
  let counter = 0;
  for (const element of source) {
    if (predicate(element)) {
      counter++;
      break;
    }
  }
  return counter > 0;
});

type All = {
  <T>(predicate: Predicate<T>): (source: Iterable<T>) => boolean;
  <T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
};

/**
 * Returns true if all of the elements matches the predicate.
 *
 * @category predicates
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param predicate
 */
export const all: All = curry2((source: any, predicate?: any): any => {
  for (const element of source) {
    if (!predicate(element)) {
      return false;
    }
  }
  return true;
});

type None = {
  <T>(predicate: Predicate<T>): (source: Iterable<T>) => boolean;
  <T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
};

/**
 * Returns true if none of the elements matches the predicate.
 *
 * @category predicates
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param predicate
 */
export const none: None = curry2((source: any, predicate?: any): any => {
  for (const element of source) {
    if (predicate(element)) {
      return false;
    }
  }
  return true;
});

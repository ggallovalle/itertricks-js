import { Predicate } from "./internal/types";
import { curry2 } from "./internal/functools";

type Filter = {
  <T>(predicate: Predicate<T>): (source: Iterable<T>) => Generator<T>;
  <T>(source: Iterable<T>, predicate: Predicate<T>): Generator<T>;
};

/**
 * Create a new iterable with the elements from `source` that match the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param predicate
 */
export const filter: Filter = curry2(function* (source: any, predicate: any) {
  for (const sourceElement of source) {
    if (predicate(sourceElement)) {
      yield sourceElement;
    }
  }
});

type FilterNot = {
  <T>(predicate: Predicate<T>): (source: Iterable<T>) => Generator<T>;
  <T>(source: Iterable<T>, predicate: Predicate<T>): Generator<T>;
};

/**
 * Create a new iterable with the elements from `source` that does not match the `predicate`.
 *
 * @category filters
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param predicate
 */
export const filterNot: FilterNot = curry2(function* (
  source: any,
  predicate: any
) {
  for (const sourceElement of source) {
    if (!predicate(sourceElement)) {
      yield sourceElement;
    }
  }
});

type Some = {
  <T>(predicate: Predicate<T>): (source: Iterable<T>) => boolean;
  <T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
};

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
export const some: Some = curry2((source: any, predicate?: any): any => {
  return;
});

type All = {
  <T>(predicate: Predicate<T>): (source: Iterable<T>) => boolean;
  <T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
};

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
export const all: All = curry2((source: any, predicate?: any): any => {
  return;
});

type None = {
  <T>(predicate: Predicate<T>): (source: Iterable<T>) => boolean;
  <T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
};

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

export const none: None = curry2((source: any, predicate?: any): any => {
  return;
});

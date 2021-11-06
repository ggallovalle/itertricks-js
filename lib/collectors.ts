import { add } from "./internal/mathtools";
import { upsertMap } from "./internal/maptools";
import { Monoid, Predicate, Semigroup } from "./internal/types";
import { curry2, curry3 } from "./internal/functools";
import { getIterator, isFunction, isMonoid, isSemigroup } from "./internal/is";
import { NotMonoidError } from "./internal/errors";

/**
 * Collect `source` into an Array.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 */
export function asArray<T>(source: Iterable<T>): T[] {
  return [...source];
}

type AsCount = {
  <T>(predicate: Predicate<T>): (source: Iterable<T>) => number;
  <T>(source: Iterable<T>, predicate: Predicate<T>): number;
};

/**
 * Count the number of elements that matches the `predicate`.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param predicate
 */
export const asCount: AsCount = curry2((source: any, predicate: any) => {
  let counter = 0;
  for (const sourceElement of source) {
    if (predicate(sourceElement)) {
      counter++;
    }
  }
  return counter;
});

/**
 * Count the number of times each element appears in the `source`.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 */
export function asCounter<T>(source: Iterable<T>): Map<T, number> {
  const cache = new Map<T, number>();
  for (const sourceElem of source) {
    upsertMap(cache, sourceElem, 1, add());
  }
  return cache;
}

type GroupBy = {
  <TValue, TKey = TValue, TTransformed = TValue>(
    keySelector: (element: TValue) => TKey,
    elementTransform?: (element: TValue) => TTransformed
  ): (source: Iterable<TKey>) => Map<TKey, TValue>;
  <TValue, TKey = TValue, TTransformed = TValue>(
    source: Iterable<TKey>,
    keySelector: (element: TValue) => TKey,
    elementTransform?: (element: TValue) => TTransformed
  ): Map<TKey, TValue>;
};

/**
 * Group the `source` items into a given key which is returned by the `keySelector`.
 * The `elementTransform` optional parameter allows to transform every single
 * element which is grouped.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param keySelector
 * @param elementTransform
 */
export const groupBy: GroupBy = curry3(
  isFunction,
  (source: any, keySelector: any, elementTransform?: any) => {
    return;
  }
);

type Fold = {
  <TInitial, TValue>(monoid: Monoid<TInitial>): (
    source: Iterable<TValue>
  ) => TInitial;
  <TInitial, TValue>(
    initial: TInitial,
    concat: (accumulator: TInitial, current: TValue) => TInitial
  ): (source: Iterable<TValue>) => TInitial;
  <TInitial, TValue>(
    source: Iterable<TValue>,
    monoid: Monoid<TInitial>
  ): TInitial;
  <TInitial, TValue>(
    source: Iterable<TValue>,
    initial: TInitial,
    concat: (accumulator: TInitial, current: TValue) => TInitial
  ): TInitial;
};

/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result
 * of each iteration into the `concat` OR `Monoid.concat` and with an initial value of `initial`
 * OR `Monoid.initial`. See {@link reduce} for a function without an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param initial
 * @param concat
 */
export const fold: Fold = function curried(
  source: any,
  initial?: any,
  concat?: any
): any {
  if (arguments.length === 1) {
    if (!isMonoid(source)) {
      throw new NotMonoidError();
    }
    return curried(source.empty, source.concat);
  }
  if (arguments.length === 2) {
    return (_source: any) => curried(_source, source, initial);
  }
  let accumulator = initial;
  for (const element of source) {
    accumulator = concat(accumulator, element);
  }
  return accumulator;
};

/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result of each iteration
 * into the `concat` OR `Monoid.concat` and with an initial value of `initial` OR `Monoid.initial`.
 * The iteration is done from the end to the start of the `source` (AKA in reversed order).
 * See {@link reduceRight} for a function without an `initial`required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param initial
 * @param concat
 */
export const foldRight: Fold = (
  source: any,
  initial?: any,
  concat?: any
): any => {
  return;
};

type Reduce = {
  <T>(semigroup: Semigroup<T>): (source: Iterable<T>) => T;
  <T>(concat: (accumulator: T, current: T) => T): (source: Iterable<T>) => T;
  <T>(source: Iterable<T>, semigroup: Semigroup<T>): T;
  <T>(source: Iterable<T>, concat: (accumulator: T, current: T) => T): T;
};

/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result
 * of each iteration into the `concat` OR `Semigroup.concat`. See {@link fold} for a
 * function with an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param concat
 */
export const reduce: Reduce = function curried(source: any, concat?: any): any {
  if (arguments.length === 1) {
    return (_source: any) => curried(_source, source);
  }

  concat = isSemigroup(concat) ? concat.concat : concat;
  const iter = getIterator(source);
  let first = iter.next();
  let accumulator = first.value ?? [];
  first = iter.next();
  while (!first.done) {
    accumulator = concat(accumulator, first.value);
    first = iter.next();
  }
  return accumulator;
};

/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the
 * result of each iteration into the `concat` OR `Semigroup.concat`. The iteration is done
 * from the end to the start of the `source` (AKA in reversed order). See {@link foldRight}
 * for a function with an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param concat
 */
export const reduceRight: Reduce = function curried(
  source: any,
  concat?: any
): any {
  if (arguments.length === 1) {
    return (_source: any) => curried(_source, source);
  }
  concat = isSemigroup(concat) ? concat.concat : concat;
  const arr = asArray(source);
  return arr.length === 0
    ? []
    : arr.reduceRight((prev, curr) => concat(prev, curr));
};

/**
 * It is like {@link fold} but it is used to save the accumulated  value produced by each
 * `concat` OR `Monoid.concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param initial
 * @param concat
 */
export const scanFold: Fold = (
  source: any,
  initial?: any,
  concat?: any
): any => {
  return;
};

/**
 * It is like {@link foldRight} but it is used to save the accumulated  value produced by each
 * `concat` OR `Monoid.concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param initial
 * @param concat
 */
export const scanFoldRight: Fold = (
  source: any,
  initial?: any,
  concat?: any
): any => {
  return;
};

/**
 * It is like {@link reduce} but it is used to save the accumulated  value produced by each
 * `concat` OR `Semigroup.concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param concat
 */
export const scan: Reduce = (source: any, concat?: any): any => {
  return;
};

/**
 * It is like {@link reduceRight} but it is used to save the accumulated  value produced by each
 * `concat` OR `Semigroup.concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param concat
 */
export const scanRight: Reduce = (source: any, concat?: any): any => {
  return;
};

import { add } from "./internal/mathtools";
import { upsertMap } from "./internal/maptools";
import { Monoid, Predicate, Semigroup } from "./internal/types";

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

/**
 * Count the number of elements that matches the `predicate`.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param predicate
 */
export function asCount<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => number {
  return (source) => {
    let counter = 0;
    for (const sourceElement of source) {
      if (predicate(sourceElement)) {
        counter++;
      }
    }
    return counter;
  };
}

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

/**
 * Group the `source` items into a given key which is returned by the `keySelector`.
 * The `elementTransform` optional parameter allows to transform every single
 * element which is grouped.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param keySelector
 * @param elementTransform
 */
export function groupBy<TValue, TKey = TValue, TTransformed = TValue>(
  keySelector: (element: TValue) => TKey,
  elementTransform?: (element: TValue) => TTransformed
): (source: Iterable<TKey>) => Map<TKey, TValue>;
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
export function groupBy<TValue, TKey = TValue, TTransformed = TValue>(
  source: Iterable<TKey>,
  keySelector: (element: TValue) => TKey,
  elementTransform?: (element: TValue) => TTransformed
): Map<TKey, TValue>;
export function groupBy(x: unknown, y?: unknown, z?: unknown): unknown {
  return;
}

/**
 * Reduce the elements in a `source` to a single value, passing the result of each iteration
 * into the `Monoid.concat` and with an initial value of `Monoid.empty`. See {@link reduce} for
 * a function without an initial required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param monoid
 */
export function fold<TInitial, TValue>(
  monoid: Monoid<TInitial>
): (source: Iterable<TValue>) => TInitial;
/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result of each iteration
 * into the `concat` and with an initial value of `initial`. See {@link reduce} for
 * a function without an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param initial
 * @param concat
 */
export function fold<TInitial, TValue>(
  initial: TInitial,
  concat: (accumulator: TInitial, current: TValue) => TInitial
): (source: Iterable<TValue>) => TInitial;
/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result of each iteration
 * into the `concat` and with an initial value of `initial`. See {@link reduce} for
 * a function without an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param initial
 * @param concat
 */
export function fold<TInitial, TValue>(
  source: Iterable<TValue>,
  initial: TInitial,
  concat: (accumulator: TInitial, current: TValue) => TInitial
): TInitial;
export function fold(x: unknown, y?: unknown, z?: unknown): unknown {
  return;
}

/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result of each iteration
 * into the `Monoid.concat` and with an initial value of `Monoid.empty`. The iteration is done from the
 * end to the start of the `source` (AKA in reversed order). See {@link reduceRight} for
 * a function without an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param monoid
 */
export function foldRight<TInitial, TValue>(
  monoid: Monoid<TInitial>
): (source: Iterable<TValue>) => TInitial;
/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result of each iteration
 * into the `concat` and with an initial value of `initial`. The iteration is done from the
 * end to the start of the `source` (AKA in reversed order). See {@link reduceRight} for
 * a function without an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param initial
 * @param concat
 */
export function foldRight<TInitial, TValue>(
  initial: TInitial,
  concat: (accumulator: TInitial, current: TValue) => TInitial
): (source: Iterable<TValue>) => TInitial;
/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result of each iteration
 * into the `concat` and with an initial value of `initial`. The iteration is done from the
 * end to the start of the `source` (AKA in reversed order). See {@link reduceRight} for a
 * function without an `initial`required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param initial
 * @param concat
 */
export function foldRight<TInitial, TValue>(
  source: Iterable<TValue>,
  initial: TInitial,
  concat: (accumulator: TInitial, current: TValue) => TInitial
): TInitial;
export function foldRight(x: unknown, y?: unknown, z?: unknown): unknown {
  return;
}

/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result of each iteration
 * into the `Semigroup.concat`. See {@link fold} for a function with an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param semigroup
 */
export function reduce<T>(semigroup: Semigroup<T>): (source: Iterable<T>) => T;
/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result of each iteration
 * into the `concat`. See {@link fold} for a function with an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param concat
 */
export function reduce<T>(
  concat: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result of each iteration
 * into the `concat`. See {@link fold} for a function with an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param concat
 */
export function reduce<T>(
  source: Iterable<T>,
  concat: (accumulator: T, current: T) => T
): T;
export function reduce(x: unknown, y?: unknown): unknown {
  return;
}

/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result of each iteration
 * into the `Semigroup.concat`. The iteration is done from the end to the start of the `source`
 * (AKA in reversed order). See {@link foldRight} for a function with an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param semigroup
 */
export function reduceRight<T>(
  semigroup: Semigroup<T>
): (source: Iterable<T>) => T;
/**
 * Reduce/Aggregate/Accumulate the elements in `source` to a single value, passing the result of each iteration
 * into the `concat`. The iteration is done from the end to the start of the `source` (AKA in reversed order).
 * See {@link foldRight} for a function with an `initial` required parameter.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param concat
 */
export function reduceRight<T>(
  concat: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
/**
 * C
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param concat
 */
export function reduceRight<T>(
  source: Iterable<T>,
  concat: (accumulator: T, current: T) => T
): T;
export function reduceRight(x: unknown, y?: unknown): unknown {
  return;
}

/**
 * It is like {@link fold} but it is used to save the accumulated  value produced by each
 * `Monoid.concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param monoid
 */
export function scanFold<T>(monoid: Monoid<T>): (source: Iterable<T>) => T;
/**
 * It is like {@link fold} but it is used to save the accumulated  value produced by each
 * `concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param initial
 * @param concat
 */
export function scanFold<T>(
  initial: T,
  concat: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
/**
 * It is like {@link fold} but it is used to save the accumulated  value produced by each
 * `concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param initial
 * @param concat
 */
export function scanFold<T>(
  source: Iterable<T>,
  initial: T,
  concat: (accumulator: T, current: T) => T
): T;
export function scanFold(x: unknown, y?: unknown, z?: unknown): unknown {
  return;
}

/**
 * It is like {@link foldRight} but it is used to save the accumulated  value produced by each
 * `Semigroup.concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param semigroup
 */
export function scanFoldRight<T>(
  semigroup: Semigroup<T>
): (source: Iterable<T>) => T;
/**
 * It is like {@link foldRight} but it is used to save the accumulated  value produced by each
 * `concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param initial
 * @param concat
 */
export function scanFoldRight<T>(
  initial: T,
  concat: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
/**
 * It is like {@link foldRight} but it is used to save the accumulated  value produced by each
 * `concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param initial
 * @param concat
 */
export function scanFoldRight<T>(
  source: Iterable<T>,
  initial: T,
  concat: (accumulator: T, current: T) => T
): T;
export function scanFoldRight(x: unknown, y?: unknown, z?: unknown): unknown {
  return;
}

/**
 * It is like {@link reduce} but it is used to save the accumulated  value produced by each
 * `Semigroup.concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param semigroup
 */
export function scan<T>(semigroup: Semigroup<T>): (source: Iterable<T>) => T;
/**
 * It is like {@link reduce} but it is used to save the accumulated  value produced by each
 * `concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param concat
 */
export function scan<T>(
  concat: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
/**
 * It is like {@link reduce} but it is used to save the accumulated  value produced by each
 * `concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param concat
 */
export function scan<T>(
  source: Iterable<T>,
  concat: (accumulator: T, current: T) => T
): T;
export function scan(x: unknown, y?: unknown): unknown {
  return;
}

/**
 * It is like {@link reduceRight} but it is used to save the accumulated  value produced by each
 * `Semigroup.concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param semigroup
 */
export function scanRight<T>(
  semigroup: Semigroup<T>
): (source: Iterable<T>) => T;
/**
 * It is like {@link reduceRight} but it is used to save the accumulated  value produced by each
 * `concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param concat
 */
export function scanRight<T>(
  concat: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
/**
 * It is like {@link reduceRight} but it is used to save the accumulated  value produced by each
 * `concat` instead of a single value.
 *
 * @category collectors
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param concat
 */
export function scanRight<T>(
  source: Iterable<T>,
  concat: (accumulator: T, current: T) => T
): T;
export function scanRight(x: unknown, y?: unknown): unknown {
  return;
}

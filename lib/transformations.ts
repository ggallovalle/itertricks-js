import { Mapper, Tuple2, WithEntries, Zipped } from "./internal/types";
import { getIterator, isNull, isWithEntries } from "./internal/is";
import { curry2 } from "./internal/functools";

type Map = {
  <TValue, TResult>(mapper: Mapper<TValue, TResult>): (
    source: Iterable<TValue>
  ) => Generator<TResult>;
  <TValue, TResult>(
    source: Iterable<TValue>,
    mapper: Mapper<TValue, TResult>
  ): Generator<TResult>;
};

/**
 * Create a new iterator populated with the results of calling the `mapper` for each
 * element in the `source`.
 *
 * @category transformations
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param mapper
 */
export const map: Map = curry2(function* (source: any, mapper: any) {
  for (const element of source) {
    yield mapper(element);
  }
});

type MapIndexed = {
  <TKey, TValue, TResult>(mapper: (key: TKey, value: TValue) => TResult): (
    source: WithEntries<TKey, TValue> | Iterable<Tuple2<TKey, TValue>>
  ) => Generator<TResult>;
  <TKey, TValue, TResult>(
    source: WithEntries<TKey, TValue> | Iterable<Tuple2<TKey, TValue>>,
    mapper: (key: TKey, value: TValue) => TResult
  ): Generator<TResult>;
};

/**
 * Like {@link map} but the mapper is passed both the element and the index. The `source`
 * can be a {@link Tuple2} Iterable or  any builtin JavaScript collection like object, such as
 * `Array`, `Map`, `Set` or any object with an `entries()` method which returns an iterable of
 * key value pairs.
 *
 * @category transformations
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param mapper
 */
export const mapIndexed: MapIndexed = curry2(function* (
  source: any,
  mapper?: any
) {
  if (isWithEntries(source)) {
    for (const [key, value] of source.entries()) {
      yield mapper(key, value);
    }
  } else {
    for (const [key, value] of source) {
      yield mapper(key, value);
    }
  }
});

type MapNotNull = {
  <TValue, TResult>(mapper: Mapper<TValue, TResult | null>): (
    source: Iterable<TValue>
  ) => Generator<TResult>;
  <TValue, TResult>(
    source: Iterable<TValue>,
    mapper: Mapper<TValue, TResult | null>
  ): Generator<TResult>;
};

/**
 * Like {@link map} but if mapper returns `null` or `undefined`, do not include it in the result.
 *
 * @category transformations
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param mapper
 */
export const mapNotNull: MapNotNull = curry2(function* (
  source: any,
  mapper?: any
) {
  for (const element of source) {
    const x = mapper(element);
    if (isNull(x)) {
      continue;
    }
    yield x;
  }
});

type MapIndexedNotNull = {
  <TKey, TValue, TResult>(
    mapper: (key: TKey, value: TValue) => TResult | null
  ): (
    source: WithEntries<TKey, TValue> | Iterable<Tuple2<TKey, TValue>>
  ) => Generator<TResult>;
  <TKey, TValue, TResult>(
    source: WithEntries<TKey, TValue> | Iterable<Tuple2<TKey, TValue>>,
    mapper: (key: TKey, value: TValue) => TResult | null
  ): Generator<TResult>;
};

/**
 * Is {@link mapIndexed} and {@link mapNotNull} combined. The `source` can be  a {@link Tuple2}
 * Iterable or any builtin JavaScript collection like object, such as `Array`, `Map`, `Set` and
 * even a plain old object, such as one made from an object literal `{}` or an instance of a class.
 * @remarks
 * The behaviour of applying it into a plain object is the same as [MDN Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
 *
 * @category transformations
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param mapper
 */
export const mapIndexedNotNull: MapIndexedNotNull = curry2(function* (
  source: any,
  mapper?: any
) {
  if (isWithEntries(source)) {
    for (const [key, value] of source.entries()) {
      const result = mapper(key, value);
      if (isNull(result)) {
        continue;
      }
      yield result;
    }
  } else {
    for (const [key, value] of source) {
      const result = mapper(key, value);
      if (isNull(result)) {
        continue;
      }
      yield result;
    }
  }
});

type Zip = {
  <TRight>(right: Iterable<TRight>): <TLeft>(
    left: Iterable<TLeft>
  ) => Generator<Tuple2<TLeft, TRight>>;
  <TLeft, TRight>(left: Iterable<TLeft>, right: Iterable<TRight>): Generator<
    Tuple2<TLeft, TRight>
  >;
};

/**
 * Build a pair of elements from two `sources`. If the sources have different sizes,
 * the result is the smaller size, the element after that in the larger `source` are
 * not included in the result.
 *
 * @category transformations
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param right
 * @param left
 */
export const zip: Zip = curry2(function* (leftSource: any, rightSource: any) {
  const leftIter = getIterator(leftSource);
  const rightIter = getIterator(rightSource);
  let left = leftIter.next();
  let right = rightIter.next();
  while (left.done === right.done && (!left.done || !left.done)) {
    yield [left.value, right.value];
    left = leftIter.next();
    right = rightIter.next();
  }
});

/**
 * Split a zipped array, where the first element of the returned array is all the elements
 * from what it was the `source` and the second element of such array is what it was the
 * `other`. See {@link zip} for a better understanding.
 *
 * @category transformations
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 */
export function unzip<TLeft, TRight>(
  source: Zipped<TLeft, TRight>
): Tuple2<TLeft[], TRight[]> {
  const leftAcc: TLeft[] = [];
  const rightAcc: TRight[] = [];

  for (const [left, right] of source) {
    leftAcc.push(left);
    rightAcc.push(right);
  }
  return [leftAcc, rightAcc];
}

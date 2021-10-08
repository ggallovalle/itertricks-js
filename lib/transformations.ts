import { Mapper, Tuple2, WithEntries, Zipped } from "./internal/types";
import {
  getIterator,
  isFunction,
  isIterable,
  isNotNull,
  isPlainObject,
  isWithEntries,
} from "./internal/is";
import { curry2, curry3_2 } from "./internal/functools";

type Map = {
  <A, B>(mapper: Mapper<A, B>): (source: Iterable<A>) => Generator<B>;
  <A, B>(source: Iterable<A>, mapper: Mapper<A, B>): Generator<B>;
};

/**
 * Create a new iterator populated with the results of calling the `mapper` for each
 * element in the `source`.
 *
 * @category transformers
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
  <A, B, TIndex>(mapper: (element: A, index: TIndex) => B): (
    source: WithEntries<TIndex, A> | Iterable<Tuple2<TIndex, A>>
  ) => Generator<A>;
  <A, B, TIndex>(
    source: WithEntries<TIndex, A> | Iterable<Tuple2<TIndex, A>>,
    mapper: (element: A, index: TIndex) => B
  ): Generator<A>;
};

/**
 * Like {@link map} but the mapper is passed both the element and the index. The `source`
 * can be a {@link Tuple2} Iterable or  any builtin JavaScript collection like object, such as
 * `Array`, `Map`, `Set` or any object with an `entries()` method which returns an iterable of
 * key value pairs.
 *
 * @category transformers
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
      yield mapper(value, key);
    }
  } else {
    for (const [key, value] of source) {
      yield mapper(value, key);
    }
  }
});

type MapNotNull = {
  <A, B>(mapper: Mapper<A, B | null>): (source: Iterable<A>) => Generator<B>;
  <A, B>(source: Iterable<A>, mapper: Mapper<A, B | null>): Generator<B>;
};

/**
 * Like {@link map} but if mapper returns `null` or `undefined`, do not include it in the result.
 *
 * @category transformers
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
    if (isNotNull(x)) {
      yield x;
    }
  }
});

type MapIndexedNotNull = {
  <A, B, TIndex>(mapper: (element: A, index: TIndex) => B): (
    source: WithEntries<TIndex, A> | Iterable<Tuple2<TIndex, A>>
  ) => Generator<A>;
  <A, B, TIndex>(
    source: WithEntries<TIndex, A> | Iterable<Tuple2<TIndex, A>>,
    mapper: (element: A, index: TIndex) => B
  ): Generator<A>;
};

/**
 * Is {@link mapIndexed} and {@link mapNotNull} combined. The `source` can be  a {@link Tuple2}
 * Iterable or any builtin JavaScript collection like object, such as `Array`, `Map`, `Set` and
 * even a plain old object, such as one made from an object literal `{}` or an instance of a class.
 * @remarks
 * The behaviour of applying it into a plain object is the same as [MDN Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
 *
 * @category transformers
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
      const result = mapper(value, key);
      if (isNotNull(result)) {
        yield result;
      }
    }
  } else {
    for (const [key, value] of source) {
      const result = mapper(value, key);
      if (isNotNull(result)) {
        yield result;
      }
    }
  }
});

type Zip = {
  <B>(other: Iterable<B>): <A>(source: Iterable<A>) => Zipped<A, B>;
  <B, A, TResult>(other: Iterable<B>, mapper: (a: A, b: B) => TResult): (
    source: Iterable<A>
  ) => TResult[];
  <A, B>(source: Iterable<A>, other: Iterable<B>): Zipped<A, B>;
  <A, B, TResult>(
    source: Iterable<A>,
    other: Iterable<B>,
    mapper: (a: A, b: B) => TResult
  ): TResult[];
};

/**
 * Build a pair of elements from two `sources`. If the sources have different sizes,
 * the result is the smaller size, the element after that in the larger `source` are
 * not included in the result.
 *
 * If `mapper` is provided call it for zipped element.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param other
 * @param mapper
 */
export const zip: Zip = curry3_2(
  isIterable,
  (x) => x == null || isFunction(x),
  (source: any, other: any, mapper: any) => {
    const firstIter = getIterator(source);
    const secondIter = getIterator(other);
    const accumulator = [];
    let first = firstIter.next();
    let second = secondIter.next();
    if (mapper != null) {
      while (first.done === second.done && (!first.done || !first.done)) {
        accumulator.push(mapper(first.value, second.value));
        first = firstIter.next();
        second = secondIter.next();
      }
    } else {
      while (first.done === second.done && (!first.done || !first.done)) {
        accumulator.push([first.value, second.value]);
        first = firstIter.next();
        second = secondIter.next();
      }
    }
    return accumulator;
  }
);

/**
 * Split a zipped array, where the first element of the returned array is all the elements
 * from what it was the `source` and the second element of such array is what it was the
 * `other`. See {@link zip} for a better understanding.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 */
export function unzip<A, B>(source: Zipped<A, B>): Tuple2<A[], B[]> {
  const accA: A[] = [];
  const accB: B[] = [];

  for (const [a, b] of source) {
    accA.push(a);
    accB.push(b);
  }
  return [accA, accB];
}

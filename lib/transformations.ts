import { Mapper, Tuple2, WithEntries, Zipped } from "./internal/types";
import { getIterator, isIterable } from "./internal/is";

/**
 * Create a new iterator populated with the results of calling the `mapper` for each
 * element in the `source`.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param mapper
 */
export function map<A, B>(
  mapper: Mapper<A, B>
): (source: Iterable<A>) => Generator<B>;
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
export function map<A, B>(
  source: Iterable<A>,
  mapper: Mapper<A, B>
): Generator<B>;
export function map(x: unknown, y?: unknown): unknown {
  let mapper: Mapper<unknown, unknown>;
  if (isIterable(x)) {
    mapper = y as Mapper<unknown, unknown>;
  } else {
    mapper = x as Mapper<unknown, unknown>;
  }

  function* logic(source: Iterable<unknown>) {
    for (const x1 of source) {
      yield mapper(x1);
    }
  }

  if (isIterable(x)) {
    return logic(x);
  } else {
    return logic;
  }
}

/**
 * Like {@link map} but the mapper is passed both the element and the index. The `source`
 * can be any builtin JavaScript collection like object, such as `Array`, `Map`, `Set` and
 * even a plain old object, such as one made from an object literal `{}` or an instance of
 * your own class class.
 * @remarks
 * The behaviour of applying it into a plain object is the same as [MDN Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param mapper
 */
export function mapIndexed<A, B, TIndex>(
  mapper: (element: A, index: TIndex) => B
): (source: WithEntries<TIndex, A>) => Generator<A>;
/**
 * Like {@link map} but the mapper is passed both the element and the index.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param mapper
 */
export function mapIndexed<A, B, TIndex>(
  mapper: (element: A, index: TIndex) => B
): (source: Iterable<[TIndex, A]>) => Generator<A>;
/**
 * Like {@link map} but the mapper is passed both the element and the index. The `source`
 * can be any builtin JavaScript collection like object, such as `Array`, `Map`, `Set` and
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
export function mapIndexed<A, B, TIndex>(
  source: WithEntries<TIndex, A>,
  mapper: (element: A, index: TIndex) => B
): Generator<A>;
/**
 * Like {@link map} but the mapper is passed both the element and the index.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param mapper
 */
export function mapIndexed<A, B, TIndex>(
  source: Iterable<[TIndex, A]>,
  mapper: (element: A, index: TIndex) => B
): Generator<A>;
export function mapIndexed(x: unknown, y?: unknown): unknown {
  return;
}

/**
 * Like {@link map} but the ignore the value returned by `mapper` if it returns
 * `null` or `undefined`.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param mapper
 */
export function mapNotNull<A, B>(
  mapper: Mapper<A, B | null>
): (source: Iterable<A>) => Generator<B>;
/**
 * Like {@link map} but the ignore the value returned by `mapper` if it returns
 * `null` or `undefined`.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param mapper
 */
export function mapNotNull<A, B>(
  source: Iterable<A>,
  mapper: Mapper<A, B | null>
): Generator<B>;
export function mapNotNull(x: unknown, y?: unknown): unknown {
  return;
}

/**
 *
 * Is {@link mapIndexed} and {@link mapNotNull} combined. The `source`
 * can be any builtin JavaScript collection like object, such as `Array`, `Map`, `Set` and
 * even a plain old object, such as one made from an object literal `{}` or an instance of a class
 * @remarks
 * The behaviour of applying it into a plain object is the same as [MDN Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param mapper
 */
export function mapIndexedNotNull<A, B, TIndex>(
  mapper: (element: A, index: TIndex) => B
): (source: WithEntries<TIndex, A>) => Generator<A>;
/**
 * Is {@link mapIndexed} and {@link mapNotNull} combined.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param mapper
 */
export function mapIndexedNotNull<A, B, TIndex>(
  mapper: (element: A, index: TIndex) => B | null
): (source: Iterable<[TIndex, A]>) => Generator<A>;
/**
 * Is {@link mapIndexed} and {@link mapNotNull} combined.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param mapper
 */
export function mapIndexedNotNull<A, B, TIndex>(
  source: Iterable<[TIndex, A]>,
  mapper: (element: A, index: TIndex) => B | null
): Generator<A>;
/**
 * Is {@link mapIndexed} and {@link mapNotNull} combined.. The `source` can be any builtin
 * JavaScript collection like object, such as `Array`, `Map`, `Set` and even a plain old
 * object, such as one made from an object literal `{}` or an instance of a class.
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
export function mapIndexedNotNull<A, B, TIndex>(
  source: WithEntries<TIndex, A>,
  mapper: (element: A, index: TIndex) => B
): Generator<A>;
export function mapIndexedNotNull(x: unknown, y?: unknown): unknown {
  return;
}

/**
 * Build a pair of elements from two `sources`. If the sources have different sizes,
 * the result is the smaller size, the element after that in the larger `source` are
 * not included in the result.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param other
 */
export function zip<B>(
  other: Iterable<B>
): <A>(source: Iterable<A>) => Zipped<A, B>;
/**
 * Build a pair of elements from two `sources`. If the sources have different sizes,
 * the result is the smaller size, the element after that in the larger `source` are
 * not included in the result. And for each pair of elements call the provided `mapper`.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param other
 * @param mapper
 */
export function zip<B, A, TResult>(
  other: Iterable<B>,
  mapper: (a: A, b: B) => TResult
): (source: Iterable<A>) => TResult[];
/**
 * Build a pair of elements from two `sources`. If the sources have different sizes,
 * the result is the smaller size, the element after that in the larger `source` are
 * not included in the result.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param other
 */
export function zip<A, B>(
  source: Iterable<A>,
  other: Iterable<B>
): Zipped<A, B>;
/**
 * Build a pair of elements from two `sources`. If the sources have different sizes,
 * the result is the smaller size, the element after that in the larger `source` are
 * not included in the result. And for each pair of elements call the provided `mapper`.
 *
 * @category transformers
 * @public
 * @since 1.0.0
 * @version 1.0.0
 * @param source
 * @param other
 * @param mapper
 */
export function zip<A, B, TResult>(
  source: Iterable<A>,
  other: Iterable<B>,
  mapper: (a: A, b: B) => TResult
): TResult[];
export function zip(x: unknown, y?: unknown, z?: unknown): unknown {
  let source!: Iterable<unknown>;
  let other: Iterable<unknown>;
  let mapper: ((a: unknown, b: unknown) => unknown) | null;

  const isCurried = !isIterable(y);
  if (isCurried) {
    other = x as Iterable<unknown>;
    mapper = y as null;
  } else {
    source = x as Iterable<unknown>;
    other = y as Iterable<unknown>;
    mapper = z as null;
  }

  function logic(source: any) {
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

  if (isCurried) {
    return logic;
  } else {
    return logic(source);
  }
}

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

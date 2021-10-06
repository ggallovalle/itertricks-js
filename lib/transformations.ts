import { Mapper, Tuple2, Zipped } from "./internal/types";
import { getIterator, isIterable } from "./internal/is";

export function map<A, B>(
  mapper: Mapper<A, B>
): (source: Iterable<A>) => Generator<B>;
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

export function zip<B>(
  other: Iterable<B>
): <A>(source: Iterable<A>) => Zipped<A, B>;
export function zip<B, A, TResult>(
  other: Iterable<B>,
  mapper: (a: A, b: B) => TResult
): (source: Iterable<A>) => TResult[];
export function zip<B, A>(
  source: Iterable<A>,
  other: Iterable<B>
): Zipped<A, B>;
export function zip<B, A, TResult>(
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

export function unzip<A, B>(source: Zipped<A, B>): Tuple2<A[], B[]> {
  const accA: A[] = [];
  const accB: B[] = [];

  for (const [a, b] of source) {
    accA.push(a);
    accB.push(b);
  }
  return [accA, accB];
}

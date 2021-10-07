import { add } from "./internal/mathtools";
import { upsertMap } from "./internal/maptools";
import { Monoid, Partitioned, Predicate, Semigroup } from "./internal/types";

export function asArray<T>(source: Iterable<T>): T[] {
  return [...source];
}

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

export function asCounter<T>(source: Iterable<T>): Map<T, number> {
  const cache = new Map<T, number>();
  for (const sourceElem of source) {
    upsertMap(cache, sourceElem, 1, add());
  }
  return cache;
}

export function partition<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => Partitioned<T, T>;
export function partition<T>(
  source: Iterable<T>,
  predicate: Predicate<T>
): Partitioned<T, T>;
export function partition(x: unknown, y?: unknown): unknown {
  return;
}

export function some<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => boolean;
export function some<T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
export function some(x: unknown, y?: unknown): unknown {
  return;
}

export function all<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => boolean;
export function all<T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
export function all(x: unknown, y?: unknown): unknown {
  return;
}

export function none<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => boolean;
export function none<T>(source: Iterable<T>, predicate: Predicate<T>): boolean;
export function none(x: unknown, y?: unknown): unknown {
  return;
}

export function groupBy<TValue, TKey = TValue, TTransformed = TValue>(
  keySelector: (element: TValue) => TKey,
  elementTransform?: (element: TValue) => TTransformed
): (source: Iterable<TKey>) => Map<TKey, TValue>;
export function groupBy<TValue, TKey = TValue, TTransformed = TValue>(
  source: Iterable<TKey>,
  keySelector: (element: TValue) => TKey,
  elementTransform?: (element: TValue) => TTransformed
): Map<TKey, TValue>;
export function groupBy(x: unknown, y?: unknown, z?: unknown): unknown {
  return;
}

export function fold<TInitial, TValue>(
  monoid: Monoid<TInitial>
): (source: Iterable<TValue>) => TInitial;
export function fold<TInitial, TValue>(
  initial: TInitial,
  concat: (accumulator: TInitial, current: TValue) => TInitial
): (source: Iterable<TValue>) => TInitial;
export function fold<TInitial, TValue>(
  source: Iterable<TValue>,
  initial: TInitial,
  concat: (accumulator: TInitial, current: TValue) => TInitial
): TInitial;
export function fold(x: unknown, y?: unknown, z?: unknown): unknown {
  return;
}

export function foldRight<TInitial, TValue>(
  monoid: Monoid<TInitial>
): (source: Iterable<TValue>) => TInitial;
export function foldRight<TInitial, TValue>(
  initial: TInitial,
  concat: (accumulator: TInitial, current: TValue) => TInitial
): (source: Iterable<TValue>) => TInitial;
export function foldRight<TInitial, TValue>(
  source: Iterable<TValue>,
  initial: TInitial,
  concat: (accumulator: TInitial, current: TValue) => TInitial
): TInitial;
export function foldRight(x: unknown, y?: unknown, z?: unknown): unknown {
  return;
}

export function reduce<T>(semigroup: Semigroup<T>): (source: Iterable<T>) => T;
export function reduce<T>(
  concat: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
export function reduce<T>(
  source: Iterable<T>,
  concat: (accumulator: T, current: T) => T
): T;
export function reduce(x: unknown, y?: unknown): unknown {
  return;
}

export function reduceRight<T>(
  semigroup: Semigroup<T>
): (source: Iterable<T>) => T;
export function reduceRight<T>(
  operation: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
export function reduceRight<T>(
  source: Iterable<T>,
  operation: (accumulator: T, current: T) => T
): T;
export function reduceRight(x: unknown, y?: unknown): unknown {
  return;
}

export function scanFold<T>(semigroup: Monoid<T>): (source: Iterable<T>) => T;
export function scanFold<T>(
  initial: T,
  operation: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
export function scanFold<T>(
  source: Iterable<T>,
  initial: T,
  operation: (accumulator: T, current: T) => T
): T;
export function scanFold(x: unknown, y?: unknown, z?: unknown): unknown {
  return;
}

export function scanFoldRight<T>(
  semigroup: Monoid<T>
): (source: Iterable<T>) => T;
export function scanFoldRight<T>(
  initial: T,
  operation: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
export function scanFoldRight<T>(
  source: Iterable<T>,
  initial: T,
  operation: (accumulator: T, current: T) => T
): T;
export function scanFoldRight(x: unknown, y?: unknown, z?: unknown): unknown {
  return;
}

export function scan<T>(semigroup: Semigroup<T>): (source: Iterable<T>) => T;
export function scan<T>(
  operation: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
export function scan<T>(
  source: Iterable<T>,
  operation: (accumulator: T, current: T) => T
): T;
export function scan(x: unknown, y?: unknown): unknown {
  return;
}

export function scanRight<T>(
  semigroup: Semigroup<T>
): (source: Iterable<T>) => T;
export function scanRight<T>(
  operation: (accumulator: T, current: T) => T
): (source: Iterable<T>) => T;
export function scanRight<T>(
  source: Iterable<T>,
  operation: (accumulator: T, current: T) => T
): T;
export function scanRight(x: unknown, y?: unknown): unknown {
  return;
}

import { Predicate } from "./internal/types";
import { isIterable } from "./internal/is";

export function filter<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => Generator<T>;
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

export function filterNot<T>(
  predicate: Predicate<T>
): (source: Iterable<T>) => Generator<T>;
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

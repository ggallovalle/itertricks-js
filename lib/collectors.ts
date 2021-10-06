import { add } from "./internal/mathtools";
import { upsertMap } from "./internal/maptools";

export function asArray<T>(source: Iterable<T>): T[] {
  return [...source];
}

export function asCount<T>(
  p: (x: T) => boolean
): (source: Iterable<T>) => number {
  return (source) => {
    let counter = 0;
    for (const sourceElement of source) {
      if (p(sourceElement)) {
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

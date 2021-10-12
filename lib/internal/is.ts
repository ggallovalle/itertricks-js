import { WithEntries } from "./types";

export function isNotNull(source: unknown): source is any {
  return source != null;
}

export function isNumber(source: unknown): source is number {
  return isNotNull(source) && typeof source === "number";
}

export function isArray(source: unknown): source is Array<any> {
  return isNotNull(source) && Array.isArray(source);
}

export function isFunction(source: unknown): source is Function {
  return isNotNull(source) && typeof source === "function";
}

export function isPlainObject(source: unknown): source is object {
  return !isFunction(source) && !isIterable(source);
}

export function isObject(source: unknown): source is object {
  return isFunction(source);
}

export function isIterable(source: unknown): source is Iterable<any> {
  // @ts-expect-error
  return isNotNull(source[Symbol.iterator]);
}

export function isIterator(source: unknown): source is Generator<any> {
  // @ts-expect-error
  return isNotNull(source.next);
}

export function getIterator(source: unknown): Iterator<unknown> {
  if (isIterable(source)) {
    return source[Symbol.iterator]();
  }
  if (isIterator(source)) {
    return source;
  }

  throw new Error(`${source} is neither an Iterable nor a Iterator`);
}

export function isWithEntries(source: any): source is WithEntries<any, any> {
  return isFunction(source.entries);
}

export function isNotNull(source: unknown): source is any {
  return source != null;
}

export function isArray(source: unknown): source is Array<any> {
  return isNotNull(source) && Array.isArray(source);
}

export function isFunction(source: unknown): source is Function {
  return isNotNull(source) && typeof source === "function";
}

export function isPlainObject(source: unknown): source is object {
  return isFunction(source) && !isArray(source);
}

export function isObject(source: unknown): source is object {
  return isFunction(source);
}

export function isIterable(source: unknown): source is Iterable<any> {
  if (isNotNull(source)) {
    return isNotNull(source[Symbol.iterator]);
  }
  return false;
}

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

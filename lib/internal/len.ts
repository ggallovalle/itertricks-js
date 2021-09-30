export type CapacityPorter =
  | {
      length: number;
    }
  | { size: number };

export default function len(source: CapacityPorter): number {
  //@ts-expect-error either has size or length
  return source.length ?? source.size;
}

export function first<T>(source: T[]): T {
  return source[0];
}

export function last<T>(source: T[]): T {
  return source[source.length - 1];
}

export function nth<T>(n: number, source: T[]): T {
  return source[n - 1];
}

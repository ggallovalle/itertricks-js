export type Predicate<T> = (element: T) => boolean;
export type Mapper<A, B> = (element: A) => B;

export type Tuple2<A, B> = [n1: A, n2: B];
export type Zipped<A, B> = Array<Tuple2<A, B>>;

/**
 * This interface is implemented in all the builtin collection objects in JavaScript,
 * such as `Array`, `Map`, `Set` and `Object.entries`.
 */
export interface WithEntries<TKey, TValue> {
  entries: () => IterableIterator<[TKey, TValue]>;
}

export interface Semigroup<A> {
  readonly concat: (x: A, y: A) => A;
}

export interface Monoid<A> extends Semigroup<A> {
  readonly empty: A;
}

export interface Partitioned<E, A> {
  /**
   * Others, things that did not matched the predicate.
   */
  readonly left: E[];

  /**
   * Matches, things that did matched the predicate.
   */
  readonly right: A[];
}

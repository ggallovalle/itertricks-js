// TODO I think there is an error in TypeScript type system, id does not
//  let me pass a single argument to `iterator.next` function
export type SafeGenerator<T, TNext = undefined, TReturn = any> = Generator<
  T,
  TReturn,
  TNext
>;
// export type SafeGenerator<T, TNext = never, TReturn = never> = Generator<T, TReturn, TNext>

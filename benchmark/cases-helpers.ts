import benny from "benny";
import util from "util";

export type Tuple1<A> = [n1: A];
export type Tuple2<A, B> = [n1: A, n2: B];
export type Tuple3<A, B, C> = [n1: A, n2: B, n3: C];

export function casesOneParameter<A>(
  args_1: Tuple1<A>[],
  functions: Array<{ message: string; sut: (a: A) => () => void }>
) {
  return args_1.flatMap(([a]) => {
    return functions.map((variant) =>
      benny.add(util.format(variant.message, a), variant.sut(a))
    );
  });
}

export function casesTwoParameter<A, B>(
  args_2: Tuple2<A, B>[],
  functions: Array<{
    message: string;
    sut: (a: A, b: B) => () => void;
  }>
) {
  return args_2.flatMap(([arg1, arg2]) => {
    return functions.map((variant) =>
      benny.add(util.format(variant.message, arg1), variant.sut(arg1, arg2))
    );
  });
}

export function casesThreeParameter<A, B, C>(
  args_3: Tuple3<A, B, C>[],
  functions: Array<{
    message: string;
    sut: (a: A, b: B, c: C) => () => void;
  }>
) {
  return args_3.flatMap(([a, b, c]) =>
    functions.map((variant) =>
      benny.add(util.format(variant.message, a), variant.sut(a, b, c))
    )
  );
}

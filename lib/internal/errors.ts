/** @internal */
export class InfiniteLoopError extends Error {
  name = "InfiniteLoopError";
}

/** @internal */
export class NotMonoidError extends Error {
  name = "NotMonoidError";
  message =
    "If you only pass 1 argument in the curried version, it must be a Monoid";
}

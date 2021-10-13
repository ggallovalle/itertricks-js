import {
  all,
  asArray,
  chunked,
  count,
  empty,
  range,
  take,
  windowed,
} from "../lib";
import { first, last, len, nth } from "../lib/internal/len";
import { pipe } from "../lib/internal/functools";

describe("#take", () => {
  describe("when there source len is less than what is taken", () => {
    // act
    const actual = pipe(range(10), take(1000), asArray);

    // assert
    test("then what is taken len is source len", () => {
      expect(len(actual)).toBe(11);
    });
  });
});

describe("#chunked", () => {
  describe("when source length is par and the size of chunk is par", () => {
    // act
    const actual = pipe(count(), take(4), chunked(2), asArray);

    // assert
    test("then each chunk has the same size", () => {
      expect(pipe(actual, first, len)).toBe(pipe(actual, last, len));
    });
  });

  describe("when source length is impar and the size of chunk is par", () => {
    // arrange
    const actual = pipe(count(), take(3), chunked(2), asArray);

    // assert
    test("then the last chunk has different size", () => {
      expect(pipe(actual, first, len)).not.toBe(pipe(actual, last, len));
    });
  });

  describe("when source length is less than chunk size", () => {
    // act
    const actual = pipe(count(), take(3), chunked(1000), asArray);

    // assert
    test("then there is only one chunk", () => {
      expect(len(actual)).toBe(1);
    });
  });

  describe("when the chunk size is less than 1", () => {
    // act
    const actual = () => {
      pipe(count(), take(1), chunked(0), asArray);
    };

    // assert
    test("then it throws an error", () => {
      expect(actual).toThrow(RangeError);
    });
  });
});

describe("#windowed", () => {
  describe("when no step or partial window passed", () => {
    // arrange
    const windowSize = 3;
    // act
    const actual = pipe(range(1, 5), windowed(windowSize), asArray);

    // assert
    test("then window step default to 1", () => {
      // step - the second of the first is the same as the first of the second
      expect(nth(2, pipe(actual, first))).toBe(first(nth(2, actual)));
    });
    test("and partial window default to false", () => {
      const allTheSameSize = pipe(
        actual,
        all((x) => len(x) == windowSize)
      );
      // partialWindow - if it allowed partial window, this would be false
      expect(allTheSameSize).toBe(true);
    });
  });

  describe("when partial window is true", () => {
    // arrange
    const windowSize = 3;
    // act
    const actual = pipe(
      range(1, 5),
      windowed(windowSize, { partialWindow: true }),
      asArray
    );

    // assert
    test("then the last one has a different len", () => {
      expect(pipe(actual, last, len)).not.toBe(windowSize);
    });
  });

  describe("when source len is less than window size and partial window is false", () => {
    // arrange
    const sourceLen = 3;
    const windowSize = 1000;
    // act
    const actual = pipe(
      count(),
      take(sourceLen),
      windowed(windowSize),
      asArray
    );

    // assert
    test("then is empty", () => {
      expect(empty(actual)).toBe(true);
    });
  });
});

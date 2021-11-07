import {
  all,
  asArray,
  chunked,
  count,
  drop,
  dropWhile,
  empty,
  range,
  take,
  takeWhile,
  windowed,
} from "../lib";
import { first, last, len, nth } from "../lib/internal/len";
import { pipe } from "../lib/internal/functools";
import { gt, lt } from "../lib/internal/mathtools";

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

describe("#takeWhile", () => {
  describe("when some elements match", () => {
    // arrange
    const sut = [1, 2, 3, 4, 5];
    const greaterThan3 = sut.filter(lt(3));
    // act
    const actual = pipe(takeWhile(sut, lt(3)), asArray);

    // assert
    test("then the len will be as much as the matched elements len", () => {
      expect(len(greaterThan3)).toBe(len(actual));
    });
  });

  describe("when none of the elements satisfy the predicate", () => {
    // act
    const actual = pipe(range(5), takeWhile(gt(25)), asArray);

    // assert
    test("then do not yield", () => {
      expect(actual).toHaveLength(0);
    });
  });
});

describe("#drop", () => {
  describe("when `n` is more than len source", () => {
    // act
    const actual = pipe(range(1, 3), drop(10), asArray);

    // assert
    test("then do not yield anything", () => {
      expect(actual).toHaveLength(0);
    });
  });

  describe("when `n` is less than len of source", () => {
    // arrange
    const n = 3;
    const howMany = 10;
    // act
    const actual = pipe(range(1, howMany), drop(n), asArray);

    // assert
    test("then len of actual is len of sut - `n`", () => {
      expect(actual).toHaveLength(howMany - n);
    });
  });
});

describe("#dropWhile", () => {
  describe("when some elements match", () => {
    // arrange
    const sut = [1, 2, 3, 4, 5];
    const greaterThan2 = [3, 4, 5];
    // act
    const actual = pipe(dropWhile(sut, lt(3)), asArray);

    // assert
    test("then the len will be as much as the matched elements len", () => {
      expect(actual).toEqual(greaterThan2);
    });
  });

  describe("when none of the elements satisfy the predicate", () => {
    // act
    const howMany = 5;
    const actual = pipe(range(howMany - 1), dropWhile(gt(25)), asArray);

    // assert
    test("then yield all the source", () => {
      expect(actual).toHaveLength(howMany);
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

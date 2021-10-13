import {
  all,
  asArray,
  asCounter,
  count,
  cycle,
  empty,
  newGenerator,
  range,
  repeat,
  take,
} from "../lib";
import { first, len, nth } from "../lib/internal/len";
import { InfiniteLoopError } from "../lib/internal/errors";
import { identity, pipe } from "../lib/internal/functools";
import { add, eq } from "../lib/internal/mathtools";

describe("#newGenerator", () => {
  describe("when an infinite generator is created", () => {
    // arrange
    const taking = 5;
    // act
    const actual = pipe(newGenerator(0, add()), take(taking), asArray);

    // assert
    test("then you can take as much as you want", () => {
      expect(len(actual)).toBe(taking);
    });
  });

  describe("when a finate generator is created", () => {
    // arrange
    const stopAt = 4;
    const taking = 1000;
    // act
    const actual = pipe(
      newGenerator(1, (a) => (a !== stopAt ? a + 1 : null)),
      take(taking),
      asArray
    );

    // assert
    test("then you can take only as much as is generated", () => {
      expect(len(actual)).toBe(stopAt);
      expect(len(actual)).toBeLessThan(taking);
    });
  });

  describe("when initial is null", () => {
    // act
    const actual = pipe(newGenerator(null, identity), asArray);

    // assert
    test("then is empty", () => {
      expect(empty(actual)).toBe(true);
    });
  });
});

describe("#range", () => {
  test("when step is 0 then throw infinite loop error", () => {
    // arrange
    const actual = () => {
      pipe(range(1, 2, 0), asArray);
    };

    // assert
    expect(actual).toThrow(InfiniteLoopError);
  });

  describe("when using default parameter", () => {
    // act
    const actual = pipe(range(3), asArray);

    // assert
    test("then start at 0", () => {
      expect(first(actual)).toBe(0);
    });
    test("and step is 1", () => {
      expect(first(actual) + 1).toBe(nth(2, actual));
    });
  });

  describe("when stop is less than start and going in incrementing order AKA step >= 1", () => {
    // arrange
    const actual1 = () => {
      const actual = pipe(range(-1), asArray);
    };
    const actual2 = () => {
      const actual = pipe(range(10, 4), asArray);
    };

    // assert
    test("then throw infinite loop error", () => {
      expect(actual1).toThrow(InfiniteLoopError);
      expect(actual2).toThrow(InfiniteLoopError);
    });
  });

  describe("when step is different than the original", () => {
    // arrange
    const step = 4;
    // act
    const actual = pipe(range(1, 10, step), asArray);

    // assert
    test("then n + 1 will be n + step", () => {
      expect(nth(2, actual)).toBe(step + 1);
    });
  });

  describe("when the step is bigger than the actual range", () => {
    // act
    const actual = pipe(range(1, 10, 1000), asArray);

    // assert
    test("then it has a len of 1", () => {
      expect(len(actual)).toBe(1);
    });
  });

  describe("when step is a negative number", () => {
    // arrange
    const start = 5;
    const step = -1;
    // act
    const actual = pipe(range(start, 0, step), asArray);

    // assert
    test("then n + 1 is start - step", () => {
      expect(nth(2, actual)).toBe(start + step);
    });
  });
});

describe("#count", () => {
  describe("when is an infinite iterable", () => {
    // arrange
    const taking = 5;
    // act
    const actual = pipe(count(), take(taking), asArray);

    // assert
    test("then take as much as you want", () => {
      expect(len(actual)).toBe(taking);
    });
  });

  describe("when is finite iterable", () => {
    // arrange
    const taking = 5;
    const stopAt = 3;
    // act
    const actual = pipe(range(1, stopAt), take(taking), asArray);

    // assert
    test("then take as much as you can", () => {
      expect(len(actual)).toBe(stopAt);
    });
  });
});

describe("#cycle", () => {
  describe("when you cycle n times", () => {
    // arrange
    const cycleTimes = 3;
    const thisMany = 4;
    // act
    const actual = pipe(
      range(1, thisMany),
      cycle,
      take(thisMany * cycleTimes),
      asArray
    );

    // assert
    test("then the elements are repeated n times", () => {
      const counter = asCounter(actual);
      expect(counter.get(1)).toBe(cycleTimes);
    });
    test("and it returns to the beginning of iterable", () => {
      expect(first(actual)).toBe(nth(thisMany + 1, actual));
    });
  });
});

describe("#repeat", () => {
  test("when given a value it repeats it indefinitely", () => {
    // arrange
    const taking = 3;
    const toRepeat = 1;
    // act
    const actual = pipe(repeat(toRepeat), take(taking), asArray);

    // assert
    const allEqual = all(actual, eq(toRepeat));
    expect(allEqual).toBe(true);
  });
});

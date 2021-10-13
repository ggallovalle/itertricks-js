import { pipe } from "../lib/internal/functools";
import {
  all,
  asArray,
  asCount,
  asCounter,
  newGenerator,
  range,
  repeat,
  take,
} from "../lib";
import { isArray } from "../lib/internal/is";
import { add, eq, gt } from "../lib/internal/mathtools";
import { len } from "../lib/internal/len";

describe("#asArray", () => {
  describe("when an array is passed", () => {
    // arrange
    const source = [1, 2, 3];
    // act
    const actual = asArray(source);

    // assert
    test("then have the same properties as before", () => {
      expect(len(actual)).toBe(len(source));
      expect(actual).toEqual(source);
    });
  });

  describe("when an iterable is passed", () => {
    // act
    const actual = pipe(range(1, 10), asArray);

    // assert
    test("then goes into an array", () => {
      expect(isArray(actual)).toBe(true);
    });
  });
});

describe("#asCount", () => {
  describe("when there are no matches in predicate", () => {
    // act
    const actual = pipe(range(1, 10), asCount(gt(1000)));

    // assert
    test("then count is 0", () => {
      expect(actual).toBe(0);
    });
  });

  describe("when there are multiple matches", () => {
    // arrange
    const taking = 10;
    const toRepeat = 3;
    // act
    const actual = pipe(repeat(toRepeat), take(taking), asCount(eq(toRepeat)));

    //assert
    test("then it does count the number of matches for the predicate", () => {
      expect(actual).toBe(taking);
    });
  });
});

describe("#asCounter", () => {
  describe("when each of the elements is different", () => {
    // arrange
    const taking = 5;
    // act
    const originalArray = pipe(newGenerator(0, add()), take(taking), asArray);
    const actual = pipe(originalArray, asCounter);

    // assert
    test("then each of the counts is 1", () => {
      const allOne = pipe(actual.values(), all(eq(1)));
      expect(allOne).toBe(true);
    });
    test("and all the elements in the original iterator are present", () => {
      const keys = pipe(actual.keys(), asArray);
      expect(keys).toEqual(originalArray);
    });
  });

  describe("when there is more than one instance of element in iterable", () => {
    // arrange
    const taking = 3;
    const toRepeat = "value";
    // act
    const actual = pipe(
      repeat(toRepeat),
      take(taking),
      asArray,
      (a) => a.concat(["a", "b"]),
      asCounter
    );

    // assert
    test("then it counts correctly such instance", () => {
      expect(actual.get(toRepeat)).toBe(taking);
    });
    test("and it counts the others correctly", () => {
      // because it counts for "value", "a", and "b"
      expect(len(actual)).toBe(3);
    });
  });
});

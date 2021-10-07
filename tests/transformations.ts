import { asArray, map, range, unzip, zip } from "../lib";
import { first, last, len } from "../lib/internal/len";
import { Zipped } from "../lib/internal/types";
import { pipe } from "../lib/internal/functools";
import { add } from "../lib/internal/mathtools";

describe("map", () => {
  test("curried", () => {
    const actual = pipe(range(1, 10), map(add()), asArray);
    expect(len(actual)).toBe(10);
    expect(first(actual)).toBe(2);
    expect(last(actual)).toBe(11);
  });

  test("non curried", () => {
    const actual = pipe(map(range(1, 10), add()), asArray);
    expect(len(actual)).toBe(10);
    expect(first(actual)).toBe(2);
    expect(last(actual)).toBe(11);
  });
});

describe("unzip", () => {
  test("zipped with contents", () => {
    const a: Zipped<number, string> = [
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ];
    const [left, right] = unzip(a);

    expect(first(left)).toBe(1);
    expect(last(left)).toBe(3);
    expect(first(right)).toBe("one");
    expect(last(right)).toBe("three");
  });

  test("zipped without contents", () => {
    const a: Zipped<number, string> = [];
    const [left, right] = unzip(a);

    expect(first(left)).toBeUndefined();
    expect(last(left)).toBeUndefined();
    expect(first(right)).toBeUndefined();
    expect(last(right)).toBeUndefined();
  });
});

describe("zip", () => {
  describe("curried", () => {
    test("zipped with contents of same length", () => {
      const actual = pipe(range(1, 10), zip(range(15, 24)));
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });

    test("zipped with first longer", () => {
      const actual = pipe(range(1, 25), zip(range(15, 24)));
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });

    test("zipped with second longer", () => {
      const actual = pipe(range(1, 10), zip(range(15, 30)));
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });

    test("with mapper", () => {
      const actual = pipe(
        range(1, 10),
        zip(range(15, 30), (x, y) => x + y)
      );
      expect(first(actual)).toEqual(16);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual(34);
    });
  });

  describe("not curried", () => {
    test("zipped with contents of same length", () => {
      const actual = zip(range(1, 10), range(15, 24));
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });

    test("zipped with first longer", () => {
      const actual = zip(range(1, 25), range(15, 24));
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });

    test("zipped with second longer", () => {
      const actual = zip(range(1, 10), range(15, 30));
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });

    test("with mapper", () => {
      const actual = zip(range(1, 10), range(15, 30), (x, y) => x + y);
      expect(first(actual)).toEqual(16);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual(34);
    });
  });
});

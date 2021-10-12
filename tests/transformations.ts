import {
  asArray,
  map,
  mapIndexed,
  mapIndexedNotNull,
  mapNotNull,
  newGenerator,
  range,
  repeat,
  take,
  unzip,
  zip,
} from "../lib";
import { first, last, len, nth } from "../lib/internal/len";
import { Tuple2, Zipped } from "../lib/internal/types";
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

describe("mapNotNull", () => {
  test("regular map works", () => {
    const actual = pipe(range(1, 10), mapNotNull(add()), asArray);
    expect(len(actual)).toBe(10);
    expect(first(actual)).toBe(2);
    expect(last(actual)).toBe(11);
  });

  test("if some is null, then it is not in the final result", () => {
    const actual = pipe(
      range(1, 10),
      mapNotNull((x) => (x % 2 === 0 ? x * 2 : null)),
      asArray
    );
    expect(len(actual)).toBe(5);
    expect(first(actual)).toBe(4);
    expect(last(actual)).toBe(20);
  });
});

describe("mapIndexed", () => {
  describe("WithEntries source", () => {
    test("array", () => {
      const actual = pipe(
        ["a", "b", "c"],
        mapIndexed((v, k) => v + k),
        asArray
      );
      expect(first(actual)).toBe("a0");
      expect(nth(2, actual)).toBe("b1");
      expect(last(actual)).toBe("c2");
    });

    test("set", () => {
      const actual = pipe(
        new Set(["x", "x", "z"]),
        mapIndexed((v, k) => v + k),
        asArray
      );
      expect(first(actual)).toBe("xx");
      expect(last(actual)).toBe("zz");
    });

    test("map", () => {
      const actual = pipe(
        new Map([
          ["x", 25],
          ["y", 40],
          ["z", 50],
        ]),
        mapIndexed((v, k) => v + k),
        asArray
      );
      expect(first(actual)).toBe("25x");
      expect(nth(2, actual)).toBe("40y");
      expect(last(actual)).toBe("50z");
    });
  });

  test("regular Tuple2 iterable", () => {
    const actual = pipe(
      repeat<Tuple2<string, string>>(["x", "y"]),
      mapIndexed((v, k) => k + v),
      take(20),
      asArray
    );
    expect(first(actual)).toBe("xy");
    expect(last(actual)).toBe("xy");
  });
});

describe("mapIndexedNotNull", () => {
  test("ignores null in the result", () => {
    const actual = pipe(
      newGenerator<Tuple2<string, number>>(["a", 0], ([k, v]) => [
        String.fromCharCode(k.charCodeAt(0) + 1), // go from a to b and so on
        v + 1,
      ]),
      take(5),
      mapIndexedNotNull((v, k) => (v % 2 === 0 ? v + k : null)),
      asArray
    );
    expect(first(actual)).toBe("0a");
    expect(len(actual)).toBe(3);
    expect(last(actual)).toBe("4e");
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
      const actual = pipe(range(1, 10), zip(range(15, 24)), asArray);
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });

    test("zipped with first longer", () => {
      const actual = pipe(range(1, 25), zip(range(15, 24)), asArray);
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });

    test("zipped with second longer", () => {
      const actual = pipe(range(1, 10), zip(range(15, 30)), asArray);
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });
  });

  describe("not curried", () => {
    test("zipped with contents of same length", () => {
      const actual = pipe(zip(range(1, 10), range(15, 24)), asArray);
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });

    test("zipped with first longer", () => {
      const actual = pipe(zip(range(1, 25), range(15, 24)), asArray);
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });

    test("zipped with second longer", () => {
      const actual = pipe(zip(range(1, 10), range(15, 30)), asArray);
      expect(first(actual)).toEqual([1, 15]);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual([10, 24]);
    });

    test("with mapper", () => {
      const actual = pipe(
        zip(range(1, 10), range(15, 30)),
        map(([x, y]) => x + y),
        asArray
      );
      expect(first(actual)).toEqual(16);
      expect(len(actual)).toBe(10);
      expect(last(actual)).toEqual(34);
    });
  });
});

import { asArray, filter, filterNot, partition, range } from "../lib";
import { pipe } from "../lib/internal/functools";
import { gt, lt } from "../lib/internal/mathtools";
import { first, last, len } from "../lib/internal/len";

describe("filter", () => {
  describe("curried", () => {
    test("every element passes the condition", () => {
      const actual = pipe(range(10), filter(lt(20)), asArray);
      expect(len(actual)).toBe(11);
      expect(first(actual)).toBe(0);
      expect(last(actual)).toBe(10);
    });

    test("x elements passes the condition", () => {
      const actual = pipe(range(10), filter(lt(5)), asArray);
      expect(len(actual)).toBe(5);
      expect(first(actual)).toBe(0);
      expect(last(actual)).toBe(4);
    });

    test("not a single element passes the condition", () => {
      const actual = pipe(range(10), filter(lt(-20)), asArray);
      expect(len(actual)).toBe(0);
      expect(first(actual)).toBeUndefined();
      expect(last(actual)).toBeUndefined();
    });
  });

  describe("non curried", () => {
    test("every element passes the condition", () => {
      const actual = pipe(filter(range(10), lt(20)), asArray);
      expect(len(actual)).toBe(11);
      expect(first(actual)).toBe(0);
      expect(last(actual)).toBe(10);
    });

    test("x elements passes the condition", () => {
      const actual = pipe(filter(range(10), lt(5)), asArray);
      expect(len(actual)).toBe(5);
      expect(first(actual)).toBe(0);
      expect(last(actual)).toBe(4);
    });

    test("not a single element passes the condition", () => {
      const actual = pipe(filter(range(10), lt(-20)), asArray);
      expect(len(actual)).toBe(0);
      expect(first(actual)).toBeUndefined();
      expect(last(actual)).toBeUndefined();
    });
  });
});

describe("filterNot", () => {
  describe("curried", () => {
    test("every element passes the condition", () => {
      const actual = pipe(range(10), filterNot(lt(0)), asArray);
      expect(len(actual)).toBe(11);
      expect(first(actual)).toBe(0);
      expect(last(actual)).toBe(10);
    });

    test("x elements passes the condition", () => {
      const actual = pipe(range(10), filterNot(lt(8)), asArray);
      expect(len(actual)).toBe(3);
      expect(first(actual)).toBe(8);
      expect(last(actual)).toBe(10);
    });

    test("not a single element passes the condition", () => {
      const actual = pipe(range(10), filterNot(gt(-1)), asArray);
      expect(len(actual)).toBe(0);
      expect(first(actual)).toBeUndefined();
      expect(last(actual)).toBeUndefined();
    });
  });

  describe("non curried", () => {
    test("every element passes the condition", () => {
      const actual = pipe(filterNot(range(10), lt(0)), asArray);
      expect(len(actual)).toBe(11);
      expect(first(actual)).toBe(0);
      expect(last(actual)).toBe(10);
    });

    test("x elements passes the condition", () => {
      const actual = pipe(filterNot(range(10), lt(8)), asArray);
      expect(len(actual)).toBe(3);
      expect(first(actual)).toBe(8);
      expect(last(actual)).toBe(10);
    });

    test("not a single element passes the condition", () => {
      const actual = pipe(filterNot(range(10), gt(-1)), asArray);
      expect(len(actual)).toBe(0);
      expect(first(actual)).toBeUndefined();
      expect(last(actual)).toBeUndefined();
    });
  });
});

describe("partition", () => {
  describe("when not a single match", () => {
    const actual = pipe(range(10), partition(gt(10)));
    test("'right' side would be empty", () => {
      expect(len(actual.right)).toBe(0);
    });
    test("'left' side would contain all the elements", () => {
      expect(len(actual.left)).toBe(11);
      expect(first(actual.left)).toBe(0);
      expect(last(actual.left)).toBe(10);
    });
  });

  test("when matches are distributed", () => {
    const actual = pipe(range(10), partition(lt(3)));
    expect(len(actual.right)).toBe(3);
    expect(len(actual.left)).toBe(8);
    expect(first(actual.right)).toBe(0);
    expect(first(actual.left)).toBe(3);
  });
});

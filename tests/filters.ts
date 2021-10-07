import { asArray, filter, filterNot, range } from "../lib";
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

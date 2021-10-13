import {
  all,
  asArray,
  count,
  filter,
  filterNot,
  none,
  partition,
  range,
} from "../lib";
import { pipe } from "../lib/internal/functools";
import { eq, gt, lt } from "../lib/internal/mathtools";
import { first, last, len } from "../lib/internal/len";

describe("#filter", () => {
  describe("when every element passes the predicate", () => {
    const actual = pipe(range(10), filter(lt(20)), asArray);

    test("then the length is the same as the source", () => {
      expect(len(actual)).toBe(11);
      expect(first(actual)).toBe(0);
      expect(last(actual)).toBe(10);
    });
  });

  describe("when not all element passes the predicate", () => {
    const actual = pipe(range(10), filter(lt(5)), asArray);

    test("then then length is less than the source", () => {
      expect(len(actual)).toBeLessThan(10);
      expect(first(actual)).toBe(0);
      expect(last(actual)).toBe(4);
    });
  });

  describe("when not a single element passes the predicate", () => {
    const actual = pipe(range(10), filter(lt(-20)), asArray);

    test("then the length is 0", () => {
      expect(len(actual)).toBe(0);
    });
  });
});

describe("#filterNot", () => {
  describe("when every element passes the condition", () => {
    const actual = pipe(range(10), filterNot(lt(0)), asArray);

    test("then the length is the same as the source", () => {
      expect(len(actual)).toBe(11);
      expect(first(actual)).toBe(0);
      expect(last(actual)).toBe(10);
    });
  });

  describe("when not all element passes the predicate", () => {
    const actual = pipe(range(10), filterNot(lt(8)), asArray);

    test("then then length is less than the source", () => {
      expect(len(actual)).toBeLessThan(10);
      expect(first(actual)).toBe(8);
      expect(last(actual)).toBe(10);
    });
  });

  describe("when not a single element passes the predicate", () => {
    const actual = pipe(range(10), filterNot(gt(-1)), asArray);

    test("then the length is 0", () => {
      expect(len(actual)).toBe(0);
    });
  });
});

describe("#partition", () => {
  describe("when not a single element match", () => {
    const actual = pipe(range(10), partition(gt(10)));

    test("then 'right' side would be empty", () => {
      expect(len(actual.right)).toBe(0);
    });

    test("and 'left' side would contain all the elements", () => {
      expect(len(actual.left)).toBe(11);
      expect(first(actual.left)).toBe(0);
      expect(last(actual.left)).toBe(10);
    });
  });

  describe("when matches are distributed", () => {
    const actual = pipe(range(10), partition(lt(3)));

    test("then the sum of the right and left length is equal to the source length", () => {
      expect(len(actual.right) + len(actual.left)).toBe(11);
    });

    test("and elements from one are not included in the other", () => {
      expect(first(actual.right)).not.toBe(first(actual.left));
    });
  });
});

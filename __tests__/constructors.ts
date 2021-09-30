import len, { first, last, nth } from "../lib/internal/len";
import { newIterator } from "../lib/constructors";
import { take } from "../lib";

describe("itertricks.constructors", () => {
  describe("newIterator", () => {
    test("infinite iterator", () => {
      const sut = newIterator(1, (x) => x + 1);
      const actual = [...take(5, sut)];
      expect(len(actual)).toBe(5);
      expect(first(actual)).toBe(1);
      expect(last(actual)).toBe(5);
    });

    test("finite iterator", () => {
      const sut = newIterator(1, (x) => (x < 8 ? x + 2 : null));
      const actual = [...sut];
      expect(len(actual)).toBe(5);
      expect(first(actual)).toBe(1);
      expect(nth(2, actual)).toBe(3);
      expect(last(actual)).toBe(9);
    });

    test("when `seed=null` actual MUST be empty", () => {
      const sut = newIterator(null, () => null);
      const actual = [...sut];
      expect(len(actual)).toBe(0);
    });
  });
});

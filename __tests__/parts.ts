import { chunked, take, windowed } from "../lib/parts";
import { range } from "../lib/range";
import len from "../lib/internal/len";

describe("genetrix.parts", () => {
  describe("take", () => {
    test("`n=2` returns 2 elements", () => {
      const source = range(3);
      const actual = [...take(2, source)];
      expect(actual.length).toBe(2);
      expect(actual).toEqual([0, 1]);
    });

    test("`n` > `source`.length returns all source", () => {
      const source = range(3);
      const actual = [...take(1000, source)];
      expect(actual.length).toBe(4);
      expect(actual).toEqual([0, 1, 2, 3]);
    });
  });

  describe("chunked", () => {
    test("`size=2` and source par", () => {
      const source = range(3);
      const actual = [...chunked(2, source)];
      expect(actual.length).toBe(2);
      expect(actual[0]).toEqual([0, 1]);
      expect(actual[1]).toEqual([2, 3]);
    });

    test("`size=2` and source inpar", () => {
      const source = range(2);
      const actual = [...chunked(2, source)];
      expect(actual.length).toBe(2);
      expect(actual[0]).toEqual([0, 1]);
      expect(actual[1]).toEqual([2]);
    });

    test("`size` > `source`.length", () => {
      const sut = range(2);
      const res = [...chunked(1000, sut)];
      expect(res.length).toBe(1);
      expect(res[0]).toEqual([0, 1, 2]);
    });

    test("throws when `size` <= 0", () => {
      const sut = range(2);
      expect(() => {
        const res = [...chunked(0, sut)];
      }).toThrow(RangeError);
    });
  });

  describe("windowed", () => {
    test("`size=3` and `len=5` and default step", () => {
      const source = range(1, 5);
      const actual = [...windowed(3, source)];
      expect(len(actual)).toBe(3);
      expect(actual[0]).toEqual([1, 2, 3]);
      expect(actual[len(actual) - 1]).toEqual([3, 4, 5]);
    });

    test("`opts.partialWindow=true`", () => {
      const source = range(1, 5);
      const actual = [...windowed(3, source, { partialWindow: true })];
      expect(len(actual)).toBe(4);
      expect(actual[0]).toEqual([1, 2, 3]);
      expect(actual[len(actual) - 1]).toEqual([4, 5]);
    });

    test("`opts.step=3`", () => {
      const source = range(1, 10);
      const actual = [...windowed(5, source, { step: 3 })];
      expect(len(actual)).toBe(2);
      expect(actual[0]).toEqual([1, 2, 3, 4, 5]);
      expect(actual[1]).toEqual([4, 5, 6, 7, 8]);
    });
  });
});

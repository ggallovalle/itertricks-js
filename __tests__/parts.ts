import { asArray, chunked, range, take, windowed } from "../lib";
import { len } from "../lib/internal/len";
import { pipe } from "../lib/internal/functools";

describe("itertricks.parts", () => {
  describe("take", () => {
    test("`n=2` returns 2 elements", () => {
      const source = range(3);
      const actual = [...take(source, 2)];
      expect(actual.length).toBe(2);
      expect(actual).toEqual([0, 1]);
    });

    test("`n` > `source`.length returns all source", () => {
      const source = range(3);
      const actual = [...take(source, 1000)];
      expect(actual.length).toBe(4);
      expect(actual).toEqual([0, 1, 2, 3]);
    });

    test("curried version", () => {
      const actual = pipe(range(3), take(1000), asArray);
      expect(actual.length).toBe(4);
      expect(actual).toEqual([0, 1, 2, 3]);
    });
  });

  describe("chunked", () => {
    test("`size=2` and source par", () => {
      const source = range(3);
      const actual = [...chunked(source, 2)];
      expect(actual.length).toBe(2);
      expect(actual[0]).toEqual([0, 1]);
      expect(actual[1]).toEqual([2, 3]);
    });

    test("`size=2` and source inpar", () => {
      const source = range(2);
      const actual = [...chunked(source, 2)];
      expect(actual.length).toBe(2);
      expect(actual[0]).toEqual([0, 1]);
      expect(actual[1]).toEqual([2]);
    });

    test("`size` > `source`.length", () => {
      const sut = range(2);
      const res = [...chunked(sut, 1000)];
      expect(res.length).toBe(1);
      expect(res[0]).toEqual([0, 1, 2]);
    });

    test("throws when `size` <= 0", () => {
      const sut = range(2);
      expect(() => {
        const res = [...chunked(sut, 0)];
      }).toThrow(RangeError);
    });

    test("curried version", () => {
      const res = pipe(range(2), chunked(1000), asArray);
      expect(res.length).toBe(1);
      expect(res[0]).toEqual([0, 1, 2]);
    });
  });

  describe("windowed", () => {
    test("`size=3` and `len=5` and default step", () => {
      const source = range(1, 5);
      const actual = [...windowed(source, 3)];
      expect(len(actual)).toBe(3);
      expect(actual[0]).toEqual([1, 2, 3]);
      expect(actual[len(actual) - 1]).toEqual([3, 4, 5]);
    });

    test("`opts.partialWindow=true`", () => {
      const source = range(1, 5);
      const actual = [...windowed(source, 3, { partialWindow: true })];
      expect(len(actual)).toBe(4);
      expect(actual[0]).toEqual([1, 2, 3]);
      expect(actual[len(actual) - 1]).toEqual([4, 5]);
    });

    test("`opts.step=3`", () => {
      const source = range(1, 10);
      const actual = [...windowed(source, 5, { step: 3 })];
      expect(len(actual)).toBe(2);
      expect(actual[0]).toEqual([1, 2, 3, 4, 5]);
      expect(actual[1]).toEqual([4, 5, 6, 7, 8]);
    });

    test("curried", () => {
      const actual = pipe(range(1, 10), windowed(5, { step: 3 }), asArray);
      expect(len(actual)).toBe(2);
      expect(actual[0]).toEqual([1, 2, 3, 4, 5]);
      expect(actual[1]).toEqual([4, 5, 6, 7, 8]);
    });
  });
});

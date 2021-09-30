import { InfiniteLoopError, range } from "../lib/range";

describe("genetrix.range", () => {
  describe("range", () => {
    test("only pass `stop`", () => {
      const sut = [...range(3)];
      expect(sut.length).toBe(4);
      expect(sut[0]).toBe(0);
      expect(sut[sut.length - 1]).toBe(3);
    });

    test("`step=2`", () => {
      const sut = [...range(0, 5, 2)];
      expect(sut.length).toBe(3);
      expect(sut[0]).toBe(0);
      expect(sut[sut.length - 1]).toBe(4);
    });

    test("`step < 0`", () => {
      const sut = [...range(5, 0, -1)];
      expect(sut.length).toBe(6);
      expect(sut[0]).toBe(5);
      expect(sut[sut.length - 1]).toBe(0);
    });

    describe("throw infinite loops errors", () => {
      test("`range=0`", () => {
        expect(() => {
          const sut = [...range(1, 2, 0)];
        }).toThrow(InfiniteLoopError);
      });

      test("`start` > `stop` in incrementing counter", () => {
        expect(() => {
          const sut = [...range(2, 1)];
        }).toThrow(InfiniteLoopError);
      });

      test("`start` < `stop` in decrementing counter", () => {
        expect(() => {
          const sut = [...range(4, 5, -1)];
        }).toThrow(InfiniteLoopError);
      });
    });
  });
});

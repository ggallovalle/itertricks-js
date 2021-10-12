import {
  asArray,
  asCount,
  count,
  cycle,
  newGenerator,
  range,
  take,
} from "../lib";
import { first, last, len, nth } from "../lib/internal/len";
import { InfiniteLoopError } from "../lib/internal/errors";
import { isNull } from "../lib/internal/is";
import { pipe } from "../lib/internal/functools";

describe("Feature: newGenerator", () => {
  describe("Scenario: Infinite iterable", () => {
    type newGeneratorTestCases<T> = {
      params: [seed: T, f: (a: T) => T | null];
      facts: {
        len: number;
        first: number;
        last: number;
      };
      others: {
        taking: number;
      };
    };
    test.each<newGeneratorTestCases<number>>([
      {
        params: [
          1,
          function plusOne(x) {
            return x + 1;
          },
        ],
        others: {
          taking: 5,
        },
        facts: {
          len: 5,
          first: 1,
          last: 5,
        },
      },
    ])(
      `When: Seed is $params
        Then: len is $facts.len
        And: first is $facts.len
        And: last is $facts.last
            `,
      ({ params, facts, others }) => {
        const sut = newGenerator(...params);
        const actual = [...take(sut, others.taking)];
        expect(len(actual)).toBe(facts.len);
        expect(first(actual)).toBe(facts.first);
        expect(last(actual)).toBe(facts.last);
      }
    );
  });

  test("finite iterator", () => {
    const sut = newGenerator(1, (x) => (x < 8 ? x + 2 : null));
    const actual = [...sut];
    expect(len(actual)).toBe(5);
    expect(first(actual)).toBe(1);
    expect(nth(2, actual)).toBe(3);
    expect(last(actual)).toBe(9);
  });

  test("when `seed=null` actual MUST be empty", () => {
    const sut = newGenerator(null, () => null);
    const actual = [...sut];
    expect(len(actual)).toBe(0);
  });
});

describe("Feature: range", () => {
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

describe("Feature: count", () => {
  describe("Scenario: make it finite", () => {
    type countTestCases<T> = {
      then: {
        len: number;
        first: T;
        last: T;
        nth: number;
      };
      when: {
        start?: number;
        step?: number;
        taking: number;
        nth: T;
      };
    };
    test.each<countTestCases<number>>([
      {
        when: {
          taking: 20,
          nth: 5,
        },
        then: {
          len: 20,
          first: 0,
          last: 19,
          nth: 4,
        },
      },
      {
        when: {
          taking: 5,
          start: 1000,
          step: 4,
          nth: 3,
        },
        then: {
          len: 5,
          first: 1000,
          last: 1016,
          nth: 1008,
        },
      },
    ])(
      `When: Params is $params
        And: nth is $facts.nth.x
        Then: len is $facts.len
        And: first is $facts.first
        And: last is $facts.last
        And: nth is $facts.nth.expected
        `,
      ({ then, when }) => {
        const sut = isNull(when.start) ? count() : count(when.start, when.step);
        const actual = [...take(sut, when.taking)];
        expect(len(actual)).toBe(then.len);
        expect(first(actual)).toBe(then.first);
        expect(last(actual)).toBe(then.last);
        expect(nth(when.nth, actual)).toBe(then.nth);
      }
    );
  });
});

describe("Feature: cycle", () => {
  test("it returns to the beginning", () => {
    const actual = pipe(count(), take(3), cycle, take(4), asArray);
    expect(len(actual)).toBe(4);
    expect(last(actual)).toBe(0);
  });

  test("when cycles through 5 times, then it is shown 5 times", () => {
    const taking = 10;
    const cycleCount = 5;
    const actual = pipe(
      count(),
      take(taking),
      cycle,
      take(taking * cycleCount),
      asCount((x) => x == 2)
    );

    expect(actual).toBe(cycleCount);
  });
});

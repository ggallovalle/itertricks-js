import {
  all,
  asArray,
  count,
  empty,
  lessThan,
  moreThan,
  newGenerator,
  none,
  range,
  some,
} from "../lib";
import { identity, pipe } from "../lib/internal/functools";
import { eq, lt } from "../lib/internal/mathtools";

describe("#empty", () => {
  test("when source is empty then is true", () => {
    // act
    const actual = empty([]);

    // assert
    expect(actual).toBe(true);
  });

  test("when source is not empty then is false", () => {
    // act
    const actual = empty(count(0, 2));

    // assert
    expect(actual).toBe(false);
  });

  test("when source is null or undefined the is true", () => {
    // act
    const actual = pipe(newGenerator(null, identity), asArray);

    // assert
    expect(empty(actual)).toBe(true);
  });
});

describe("#moreThan", () => {
  test("when the source len is less than n then is false", () => {
    // act
    const actual = pipe(range(3), moreThan(10, lt(10)));

    // assert
    expect(actual).toBe(false);
  });

  test("when at least n matches the predicate then is true", () => {
    // act
    const actual = pipe(range(10), moreThan(3, lt(5)));

    // assert
    expect(actual).toBe(true);
  });
});

describe("#lessThan", () => {
  test("when the source len is less than n then is true", () => {
    // act
    const actual = pipe(range(3), lessThan(10, lt(10)));

    // assert
    expect(actual).toBe(true);
  });

  test("when more than n matches the predicate then is false", () => {
    // act
    const actual = pipe(range(10), lessThan(3, lt(5)));

    // assert
    expect(actual).toBe(false);
  });
});

describe("#all", () => {
  test("when the predicate matches on all elements then is true", () => {
    // act
    const actual = pipe(range(3), all(lt(10)));

    // assert
    expect(actual).toBe(true);
  });
});

describe("#none", () => {
  test("when the predicate does not matches on all elements then is true", () => {
    // act
    const actual = pipe(range(3), none(eq(5)));

    // assert
    expect(actual).toBe(true);
  });
});

describe("#some", () => {
  test("when the predicate matches on at least one element then is true", () => {
    // act
    const actual = pipe(range(3), some(eq(0)));

    // assert
    expect(actual).toBe(true);
  });
});

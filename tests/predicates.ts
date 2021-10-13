import { all, count, empty, none, range, some } from "../lib";
import { pipe } from "../lib/internal/functools";
import { eq, lt } from "../lib/internal/mathtools";
import { moreThan, lessThan } from "../lib/predicates";

describe("#empty", () => {
  test("when source is empty then is true", () => {
    const actual = empty([]);
    expect(actual).toBe(true);
  });

  test("when source is not empty then is false", () => {
    const actual = empty(count(0, 2));
    expect(actual).toBe(false);
  });
});

describe("#moreThan", () => {
  test("when the source len is less than n then is false", () => {
    const actual = pipe(range(3), moreThan(10, lt(10)));
    expect(actual).toBe(false);
  });

  test("when at least n matches the predicate then is true", () => {
    const actual = pipe(range(10), moreThan(3, lt(5)));
    expect(actual).toBe(true);
  });
});

describe("#lessThan", () => {
  test("when the source len is less than n then is true", () => {
    const actual = pipe(range(3), lessThan(10, lt(10)));
    expect(actual).toBe(true);
  });

  test("when more than n matches the predicate then is false", () => {
    const actual = pipe(range(10), lessThan(3, lt(5)));
    expect(actual).toBe(false);
  });
});

describe("#all", () => {
  test("when the predicate matches on all elements then is true", () => {
    const actual = pipe(range(3), all(lt(10)));
    expect(actual).toBe(true);
  });
});

describe("#none", () => {
  test("when the predicate does not matches on all elements then is true", () => {
    const actual = pipe(range(3), none(eq(5)));
    expect(actual).toBe(true);
  });
});

describe("#some", () => {
  test("when the predicate matches on at least one element then is true", () => {
    const actual = pipe(range(3), some(eq(0)));
    expect(actual).toBe(true);
  });
});

import { pipe } from "../lib/internal/functools";
import { asArray, asCount, asCounter, range, take, repeat } from "../lib";
import { isArray } from "../lib/internal/is";
import { le } from "../lib/internal/mathtools";

describe("asArray", () => {
  test("goes into an array", () => {
    const actual = pipe(range(1, 10), asArray);
    expect(isArray(actual)).toBe(true);
  });
});

describe("asCount", () => {
  const actual = pipe(range(1, 10), asCount(le(5)));
  expect(actual).toBe(5);
});

describe("asCounter", () => {
  const actual = pipe(repeat("test"), take(10), asCounter);
  expect(actual.get("test")).toBe(10);
});

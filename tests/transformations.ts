import {
  asArray,
  count,
  empty,
  map,
  mapIndexed,
  mapIndexedNotNull,
  mapNotNull,
  range,
  take,
  unzip,
  zip,
} from "../lib";
import { first, last, len, sample } from "../lib/internal/len";
import { Tuple2, Zipped } from "../lib/internal/types";
import { pipe } from "../lib/internal/functools";
import { add } from "../lib/internal/mathtools";

describe("#map", () => {
  describe("when given a mapper", () => {
    // arrange
    const step = 3;
    const mapper = add(step);
    const howMany = 10;
    // act
    const actual = pipe(count(1), take(howMany), map(mapper), asArray);

    // assert
    test("then it has the same len as the source", () => {
      expect(len(actual)).toBe(howMany);
    });
    test("then the operation is applied to each of its members", () => {
      expect(first(actual)).toEqual(1 + step);
      expect(last(actual)).toEqual(howMany + step);
      const random = sample(actual);
      expect(random.value).toBe(random.index + 1 + step);
    });
  });
});

describe("#mapNotNull", () => {
  describe("when every mapper returns a not null value", () => {
    // arrange
    const howMany = 10;
    const step = 1;
    const mapper = add(step);
    // act
    const actual = pipe(range(1, howMany), mapNotNull(mapper), asArray);

    // assert
    test("then it behaves like a regular map", () => {
      const random = sample(actual);
      expect(random.value).toBe(random.index + 1 + step);
      expect(len(actual)).toBe(howMany);
    });
  });

  describe("when some of the mappers return null", () => {
    // arrange
    const howManyNulls = 4;
    const taking = 10;
    // act
    const actual = pipe(
      range(1, taking),
      mapNotNull((x) => (x <= 4 ? null : x * 2)),
      asArray
    );

    // assert
    test("then the len will be source len - n times it was null", () => {
      expect(len(actual)).toBe(taking - howManyNulls);
    });
  });
});

describe("#mapIndexed", () => {
  describe("when source implements WithEntries :: () -> Tuple2", () => {
    // arrange
    const keys = ["x", "y", "z"];
    const values = [25, 30, 40];
    // act
    const actual = pipe(
      new Map(zip(keys, values)),
      mapIndexed((key, value): Tuple2<string, number> => [key, value]),
      asArray
    );
    const unzipped = unzip(actual);

    // assert
    test("then the key is passed in each step of the way", () => {
      expect(first(unzipped)).toEqual(keys);
    });
    test("and also the value is passed", () => {
      expect(last(unzipped)).toEqual(values);
    });
  });

  describe("when source is Iterable Tuple2", () => {
    // arrange
    const keys = ["x", "y", "z"];
    const values = [25, 30, 40];
    // act
    const actual = pipe(
      zip(keys, values),
      mapIndexed((key, value): Tuple2<string, number> => [key, value]),
      asArray
    );
    const unzipped = unzip(actual);

    // assert
    test("then the key is passed in each step of the way", () => {
      expect(first(unzipped)).toEqual(keys);
    });
    test("and also the value is passed", () => {
      expect(last(unzipped)).toEqual(values);
    });
  });
});

describe("#mapIndexedNotNull", () => {
  describe("when every mapper returns a not null value", () => {
    // arrange
    const keys = ["x", "y", "z"];
    const values = [25, 30, 40];
    // act
    const actual = pipe(
      zip(keys, values),
      mapIndexedNotNull((key, value): Tuple2<string, number> => [key, value]),
      asArray
    );
    const unzipped = unzip(actual);

    // assert
    test("then it behaves like a regular mapIndexed", () => {
      expect(first(unzipped)).toEqual(keys);
      expect(last(unzipped)).toEqual(values);
    });
  });

  describe("when some of the mappers return null", () => {
    // arrange
    const howManyNulls = 2;
    const keys = ["a", "b", "c", "d", "e"];
    const values = [1, 2, 3, 4, 5];
    const taking = len(values);
    // act
    const actual = pipe(
      zip(keys, values),
      mapIndexedNotNull((key, value): Tuple2<string, number> | null =>
        value <= howManyNulls ? null : [key, value]
      ),
      asArray
    );

    // assert
    test("then the len will be source len - n times it was null", () => {
      expect(len(actual)).toBe(taking - howManyNulls);
    });
  });
});

describe("#unzip", () => {
  describe("when unzipped something with contents", () => {
    // arrange
    const zipped: Zipped<number, string> = [
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ];
    // act
    const actual = unzip(zipped);

    // assert
    test("then it has a len of 2", () => {
      expect(len(actual)).toBe(2);
    });
    test("and the first one contains all the index 0 of source", () => {
      const indexZero = pipe(
        zipped,
        map(([zero]) => zero),
        asArray
      );
      expect(actual[0]).toEqual(indexZero);
    });
    test("and the second one contains all the index 1 of source", () => {
      const indexOne = pipe(
        zipped,
        map(([_, one]) => one),
        asArray
      );
      expect(actual[1]).toEqual(indexOne);
    });
  });

  describe("when unzipped something without contents", () => {
    // arrange
    const zipped: Zipped<number, string> = [];
    // act
    const actual = unzip(zipped);

    // assert
    test("then it still has a len of 2", () => {
      expect(len(actual)).toBe(2);
    });
    test("but both are empty arrays", () => {
      expect(empty(actual[0])).toBe(true);
      expect(empty(actual[1])).toBe(true);
    });
  });
});

describe("#zip", () => {
  describe("when source and other have the same len", () => {
    // arrange
    const howMany = 4;
    const source = pipe(count(1), take(howMany), asArray);
    const other = pipe(count(15), take(howMany), asArray);
    // act
    const actual = pipe(source, zip(other), asArray);

    // assert
    test("then they are both 'consumed' to the end", () => {
      const [indexZero, indexOne] = unzip(actual);
      expect(indexZero).toEqual(source);
      expect(indexOne).toEqual(other);
    });
  });

  describe("when one of the sources len is less than the other", () => {
    // arrange
    const howMany = 4;
    const source = pipe(count(1), take(howMany), asArray);
    const other = pipe(count(15), take(howMany * 2), asArray);
    // act
    const actual = pipe(source, zip(other), asArray);

    // assert
    test("then only takes as much as the source with the smallest len", () => {
      expect(len(actual)).toEqual(len(source));
    });
  });
});

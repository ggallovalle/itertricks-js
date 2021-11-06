import { pipe } from "../lib/internal/functools";
import {
  all,
  asArray,
  asCount,
  asCounter,
  empty,
  fold,
  newGenerator,
  range,
  reduce,
  reduceRight,
  repeat,
  scan,
  scanFold,
  take,
} from "../lib";
import { isArray, isSemigroup } from "../lib/internal/is";
import { add, eq, gt } from "../lib/internal/mathtools";
import { len } from "../lib/internal/len";
import { Monoid } from "../lib/internal/types";
import { NotMonoidError } from "../lib/internal/errors";

describe("#asArray", () => {
  describe("when an array is passed", () => {
    // arrange
    const source = [1, 2, 3];
    // act
    const actual = asArray(source);

    // assert
    test("then have the same properties as before", () => {
      expect(len(actual)).toBe(len(source));
      expect(actual).toEqual(source);
    });
  });

  describe("when an iterable is passed", () => {
    // act
    const actual = pipe(range(1, 10), asArray);

    // assert
    test("then goes into an array", () => {
      expect(isArray(actual)).toBe(true);
    });
  });
});

describe("#asCount", () => {
  describe("when there are no matches in predicate", () => {
    // act
    const actual = pipe(range(1, 10), asCount(gt(1000)));

    // assert
    test("then count is 0", () => {
      expect(actual).toBe(0);
    });
  });

  describe("when there are multiple matches", () => {
    // arrange
    const taking = 10;
    const toRepeat = 3;
    // act
    const actual = pipe(repeat(toRepeat), take(taking), asCount(eq(toRepeat)));

    //assert
    test("then it does count the number of matches for the predicate", () => {
      expect(actual).toBe(taking);
    });
  });
});

describe("#asCounter", () => {
  describe("when each of the elements is different", () => {
    // arrange
    const taking = 5;
    // act
    const originalArray = pipe(newGenerator(0, add()), take(taking), asArray);
    const actual = pipe(originalArray, asCounter);

    // assert
    test("then each of the counts is 1", () => {
      const allOne = pipe(actual.values(), all(eq(1)));
      expect(allOne).toBe(true);
    });
    test("and all the elements in the original iterator are present", () => {
      const keys = pipe(actual.keys(), asArray);
      expect(keys).toEqual(originalArray);
    });
  });

  describe("when there is more than one instance of element in iterable", () => {
    // arrange
    const taking = 3;
    const toRepeat = "value";
    // act
    const actual = pipe(
      repeat(toRepeat),
      take(taking),
      asArray,
      (a) => a.concat(["a", "b"]),
      asCounter
    );

    // assert
    test("then it counts correctly such instance", () => {
      expect(actual.get(toRepeat)).toBe(taking);
    });
    test("and it counts the others correctly", () => {
      // because it counts for "value", "a", and "b"
      expect(len(actual)).toBe(3);
    });
  });
});

const monoidSum_: Monoid<number> = {
  empty: 0,
  concat: (a, b) => a + b,
};

const monoidStrConcat_: Monoid<string> = {
  empty: "",
  concat: (a, b) => a + b,
};

describe("#fold", () => {
  describe("when a monoid is passed", () => {
    // act
    const actual = pipe(range(1, 5), fold(monoidSum_));

    // assert
    test("then it works as a regular fold", () => {
      expect(actual).toBe(15);
    });
  });

  describe("when only a single argument passed and is not a monoid", () => {
    // arrange
    const actual = () => {
      pipe(range(1, 5), fold(null as any));
    };

    // assert
    test("then throws NotMonoidError", () => {
      expect(actual).toThrow(NotMonoidError);
    });
  });

  describe("when passed as regular concat and initial", () => {
    // act
    const actual = pipe(range(1, 5), fold(monoidSum_.empty, monoidSum_.concat));

    // assert
    test("then it works as a regular fold", () => {
      expect(actual).toBe(15);
    });
  });
});

describe("#reduce", () => {
  describe("when a semigroup is passed", () => {
    // act
    const actual = pipe(range(1, 5), reduce(monoidSum_));

    // assert
    test("then it works as a regular reduce", () => {
      expect(actual).toBe(15);
    });
  });

  describe("when passed as regular concat", () => {
    // act
    const actual = pipe(range(1, 5), reduce(monoidSum_.concat));

    // assert
    test("then it works as a regular reduce", () => {
      expect(actual).toBe(15);
    });
  });

  describe("when empty iterable", () => {
    const actual = reduce([], monoidSum_);
    test("then is empty", () => {
      expect(actual).toEqual([]);
    });
  });
});

describe("#reduceRight", () => {
  describe("when a semigroup is passed", () => {
    // act
    const actual = reduceRight("abcd", monoidStrConcat_);

    // assert
    test("then it works as a regular reduce", () => {
      expect(actual).toBe("dcba");
    });
  });

  describe("when passed as regular concat", () => {
    // act
    const actual = reduceRight("abcd", monoidStrConcat_.concat);

    // assert
    test("then it works as a regular reduce", () => {
      expect(actual).toBe("dcba");
    });
  });

  describe("when empty iterable", () => {
    const actual = reduceRight([], monoidStrConcat_);
    test("then is empty", () => {
      expect(actual).toEqual([]);
    });
  });
});

describe("#scan", () => {
  describe("when a semigroup is passed", () => {
    // act
    const actual = scan("abcd", monoidStrConcat_);

    // assert
    test("then it works as a regular scan", () => {
      expect(actual).toEqual(["a", "ab", "abc", "abcd"]);
    });
  });

  describe("when passed as regular concat", () => {
    // act
    const actual = scan("abcd", monoidStrConcat_);

    // assert
    test("then it works as a regular scan", () => {
      expect(actual).toEqual(["a", "ab", "abc", "abcd"]);
    });
  });

  describe("when empty iterable", () => {
    const actual = scan([], monoidSum_);
    test("then is empty", () => {
      expect(actual).toEqual([]);
    });
  });
});

describe("#scanFold", () => {
  describe("when a semigroup is passed", () => {
    // act
    const actual = scanFold("abcd", monoidStrConcat_);

    // assert
    test("then it works as a regular scan", () => {
      expect(actual).toEqual(["", "a", "ab", "abc", "abcd"]);
    });
  });

  describe("when passed as regular concat", () => {
    // act
    const actual = scanFold("abcd", monoidStrConcat_);

    // assert
    test("then it works as a regular scan", () => {
      expect(actual).toEqual(["", "a", "ab", "abc", "abcd"]);
    });
  });

  describe("when empty iterable", () => {
    const actual = scanFold([], monoidStrConcat_);
    test("then is empty", () => {
      expect(actual).toEqual([""]);
    });
  });
});

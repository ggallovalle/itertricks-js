import { pipe } from "../lib/internal/functools";
import {
  all,
  asArray,
  asCount,
  asCounter,
  fold,
  foldRight,
  groupBy,
  newGenerator,
  range,
  reduce,
  reduceRight,
  repeat,
  scan,
  scanFold,
  scanFoldRight,
  take,
} from "../lib";
import { isArray } from "../lib/internal/is";
import { add, eq, gt } from "../lib/internal/mathtools";
import { len } from "../lib/internal/len";
import { Monoid, Semigroup } from "../lib/internal/types";
import { NotMonoidError } from "../lib/internal/errors";

const _monoidSum: Monoid<number> = {
  empty: 0,
  concat: (a, b) => a + b,
};

const _monoidStrConcat: Monoid<string> = {
  empty: "",
  concat: (a, b) => a + b,
};

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

describe("#reduce", () => {
  _testReduce("reduce", _monoidSum, {
    fn: reduce,
    sut: pipe(range(1, 5), asArray),
    actual: 15,
  });
});

describe("#reduceRight", () => {
  _testReduce("reduceRight", _monoidStrConcat, {
    fn: reduceRight,
    sut: "abcd",
    actual: "dcba",
  });
});

describe("#scan", () => {
  _testReduce("scan", _monoidStrConcat, {
    fn: scan,
    sut: "abcd",
    actual: ["a", "ab", "abc", "abcd"],
  });
});

describe("#fold", () => {
  _testFold("fold", _monoidSum, {
    fn: fold,
    sut: pipe(range(1, 5), asArray),
    actual: 15,
    actualInitial: _monoidSum.empty,
  });
});

describe("#foldRight", () => {
  _testFold("foldRight", _monoidStrConcat, {
    fn: foldRight,
    sut: "abcd",
    actual: "dcba",
    actualInitial: _monoidStrConcat.empty,
  });
});

describe("#scanFold", () => {
  _testFold("scanFold", _monoidStrConcat, {
    fn: scanFold,
    sut: "abcd",
    actual: ["", "a", "ab", "abc", "abcd"],
    actualInitial: [""],
  });
});

describe("#scanFoldRight", () => {
  _testFold("scanFoldRight", _monoidStrConcat, {
    fn: scanFoldRight,
    sut: "abcd",
    actual: ["", "d", "dc", "dcb", "dcba"],
    actualInitial: [""],
  });
});

describe("#groupBy", () => {
  type _Person = {
    name: string;
    age: number;
  };
  const people: _Person[] = [
    {
      age: 10,
      name: "a",
    },
    {
      age: 20,
      name: "b",
    },
    {
      age: 30,
      name: "c",
    },
    {
      age: 40,
      name: "e",
    },
    {
      age: 50,
      name: "f",
    },
    {
      age: 60,
      name: "g",
    },
  ];
  describe("when key selector returns all different values", () => {
    // act
    const actual = groupBy(people, (it) => it.age);

    // assert
    test("then it has as n different keys", () => {
      expect(asArray(actual.keys()).length).toBe(6);
    });
    test("and it has the same elements", () => {
      const elements = asArray(actual.values()).flat();
      expect(elements).toEqual(people);
    });
  });

  describe("when key selector divides in two groups", () => {
    // act
    const actual = groupBy(people, (it) => (it.age <= 30 ? "young" : "old"));

    test("then each group contains only the ones that correspond to it", () => {
      const groupYoung = people.filter((it) => it.age <= 30);
      const groupOld = people.filter((it) => it.age > 30);
      expect(actual.get("young")).toEqual(groupYoung);
      expect(actual.get("old")).toEqual(groupOld);
    });
  });

  describe("when an element transform is passed", () => {
    // arrange
    const names = people.map((it) => it.name);
    // act
    const actual = groupBy(
      people,
      (it) => it.age,
      (it) => it.name
    );
    test("then it does transform each input", () => {
      expect(asArray(actual.values()).flat()).toEqual(names);
    });
  });
});

// -----------
// [[[ internal
// -----------

function _testReduce(
  name: string,
  semi: Semigroup<any>,
  t: { fn: any; sut: any; actual: any }
) {
  describe("when a semigroup is passed", () => {
    // act
    const actual = t.fn(t.sut, semi);

    // assert
    test(`then it works as a regular ${name}`, () => {
      expect(actual).toEqual(t.actual);
    });
  });

  describe("when passed as regular concat", () => {
    // act
    const actual = t.fn(t.sut, semi.concat);

    // assert
    test(`then it works as a regular ${name}`, () => {
      expect(actual).toEqual(t.actual);
    });
  });

  describe("when empty iterable", () => {
    const actual = t.fn([], semi);
    test("then is empty", () => {
      expect(actual).toEqual([]);
    });
  });
}

function _testFold(
  name: string,
  monoid: Monoid<any>,
  t: { fn: any; sut: any; actual: any; actualInitial: any }
) {
  describe("when a monoid is passed", () => {
    // act
    const actual = pipe(t.sut, t.fn(monoid));

    // assert
    test(`then it works as a regular ${name}`, () => {
      expect(actual).toEqual(t.actual);
    });
  });

  describe("when only a single argument passed and is not a monoid", () => {
    // arrange
    const actual = () => {
      pipe(range(1, 5), t.fn(null as any));
    };

    // assert
    test("then throws NotMonoidError", () => {
      expect(actual).toThrow(NotMonoidError);
    });
  });

  describe("when passed as regular concat and initial", () => {
    // act
    const actual = pipe(t.sut, t.fn(monoid.empty, monoid.concat));

    // assert
    test(`then it works as a regular ${name}`, () => {
      expect(actual).toEqual(t.actual);
    });
  });

  describe("when empty iterable", () => {
    const actual = t.fn([], monoid);
    test("then is empty", () => {
      expect(actual).toEqual(t.actualInitial);
    });
  });
}

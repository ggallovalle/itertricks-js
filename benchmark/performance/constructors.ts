import benny from "benny";
import { range } from "../../lib";
import { casesOneParameter } from "../cases-helpers";

function* range2(start: number, stop: number, step: number) {
  for (let index = start; index <= stop; index += step) {
    yield index;
  }
}

const cases = casesOneParameter(
  [[100], [1000], [10_000], [300_000], [800_000]],
  [
    {
      message: "JavaScript while loop with a size of %d",
      sut(endAt) {
        return () => {
          let result = 0;
          for (let counter = 0; counter <= endAt; counter++) {
            result += counter;
          }
        };
      },
    },
    {
      message: "JavaScript for-i loop with a size of %d",
      sut(endAt) {
        return () => {
          let result = 0;
          for (let counter = 0; counter <= endAt; counter++) {
            result += counter;
          }
        };
      },
    },
    {
      message: "Range with generators simplified with a size of %d",
      sut(endAt) {
        return () => {
          let result = 0;
          for (const counter of range2(0, endAt, 1)) {
            result += counter;
          }
        };
      },
    },
    {
      message: "Itertricks range with a size of %d",
      sut(endAt) {
        return () => {
          let result = 0;
          for (const counter of range(endAt)) {
            result += counter;
          }
        };
      },
    },
  ]
);

const folder = "benchmark/performance/results";

benny
  .suite(
    "Range of numbers from x to y.",
    ...cases,
    benny.cycle(),
    benny.complete(),
    benny.save({ file: "range", version: "1.0.0", folder }),
    benny.save({
      file: "range-details",
      version: "1.0.0",
      details: true,
      folder,
    }),
    benny.save({
      file: "range",
      version: "1.0.0",
      format: "table.html",
      folder,
    }),
    benny.save({
      file: "range",
      version: "1.0.0",
      format: "chart.html",
      folder,
    })
  )
  .then();

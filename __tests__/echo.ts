import { echo } from "../lib/echo";

test("echo", () => {
  expect(echo()).toBe("echo");
  expect(true).toBeTrue();
});

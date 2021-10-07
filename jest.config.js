/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  displayName: "@kbroom/itertricks",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  // setupFilesAfterEnv: ["jest-extended"],
  //#region watcher
  watchman: true,
  //#endregion
};

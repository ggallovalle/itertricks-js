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
  // setupFilesAfterEnv: ["jest-extended"],
  //#region watcher
  watchman: true,
  //#endregion
};

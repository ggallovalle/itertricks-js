const execa = require("execa");
const concurrently = require("concurrently");
const gulp = require("gulp");
const clean = require("gulp-clean");

//#region echo
function echo() {
  console.log("echo");
}

echo.displayName = "echo:test";
echo.description = "Some task description.";
echo.flags = {
  "-w": "watch",
};

exports.echo = echo;

//#endregion

//#region top level
async function build() {
  // return concurrently(["npm:docs:watch"]);
  return concurrently([
    {
      command: "npx tsc --build",
      name: "typescript",
    },
  ]);
}
build.description = "build output to ./dist";
gulp.task("build", build);

async function clear() {
  return gulp.src("dist", { read: false }).pipe(clean());
}
clear.description = "clear build output at ./dist";
gulp.task("clear", clear);
//#endregion toplevel

//#region docs
async function docsServe() {
  // return concurrently(["npm:docs:watch"]);
  return concurrently([
    {
      command: "npx typedoc --watch",
      name: "typedoc",
    },
    {
      command: "npx http-server docs",
      name: "server",
    },
  ]);
}
docsServe.description = "watch and start documentation in port :8080";
// gulp.task("docs:start", docsServe);
gulp.task("start:docs", docsServe);

async function docsBuild() {
  return concurrently(["npx typedoc"]);
}
docsBuild.description = "build documentation to ./docs";
// gulp.task("docs:build", docsBuild);
gulp.task("build:docs", docsBuild);

async function docsClear() {
  return gulp.src("docs", { read: false }).pipe(clean());
}
docsClear.description = "clear documentation build output at ./docs";
// gulp.task("docs:clear", docsClear);
gulp.task("clear:docs", docsClear);
//#endregion docs

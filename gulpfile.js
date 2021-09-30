const execa = require("execa");

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

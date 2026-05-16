const { spawnSync } = require("child_process");

function run(command, args) {
  const executable = process.platform === "win32" && command === "npm" ? "cmd.exe" : command;
  const commandArgs = process.platform === "win32" && command === "npm"
    ? ["/d", "/s", "/c", "npm.cmd", ...args]
    : args;
  const result = spawnSync(executable, commandArgs, {
    stdio: "inherit"
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run("npm", ["run", "lint"]);
run("npm", ["run", "package"]);

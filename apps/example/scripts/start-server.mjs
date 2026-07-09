import { execSync, spawn } from "node:child_process";

execSync("npx next build --webpack", {
  stdio: "inherit",
});

const child = spawn("npx", ["next", "start", "-p", "4100"], {
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

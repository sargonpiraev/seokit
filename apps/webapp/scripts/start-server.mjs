import { spawn } from "node:child_process";

/** App is built by `npm test` before Playwright starts the server. */
const child = spawn("npx", ["next", "start", "-p", "4100"], {
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

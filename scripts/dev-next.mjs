import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const preferredPort = Number(process.argv[2]);
const maxAttempts = 50;

if (!Number.isInteger(preferredPort) || preferredPort <= 0) {
  console.error("Usage: dev-next.mjs <preferred-port>");
  process.exit(1);
}

const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(monorepoRoot, "node_modules", ".bin", "next");

function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function clearDevLock(cwd) {
  const lockPath = path.join(cwd, ".next/dev/lock");
  if (!fs.existsSync(lockPath)) {
    return;
  }

  let lock;
  try {
    lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  } catch {
    fs.rmSync(lockPath, { force: true });
    return;
  }

  const pid = lock?.pid;
  if (typeof pid === "number" && isProcessAlive(pid)) {
    console.warn(`Stopping existing Next.js dev server (pid ${pid}, port ${lock.port}).`);
    process.kill(pid, "SIGTERM");
  }

  fs.rmSync(lockPath, { force: true });
}

function isAddrInUse(output) {
  return output.includes("EADDRINUSE") || output.includes("address already in use");
}

function isDevLockConflict(output) {
  return output.includes("Another next dev server is already running");
}

function attemptStart(port) {
  return new Promise((resolve) => {
    const child = spawn(nextBin, ["dev", "--port", String(port)], {
      cwd: process.cwd(),
      stdio: ["inherit", "pipe", "pipe"],
    });

    let output = "";
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(readyTimer);
      resolve(result);
    };

    const inspectOutput = () => {
      if (isDevLockConflict(output)) {
        child.kill("SIGTERM");
        finish({ status: "dev-lock-conflict" });
        return;
      }

      if (isAddrInUse(output)) {
        child.kill("SIGTERM");
        finish({ status: "port-busy" });
        return;
      }

      if (output.includes("Ready in")) {
        finish({ status: "started", child });
      }
    };

    const onStdout = (chunk) => {
      output += chunk.toString();
      process.stdout.write(chunk);
      inspectOutput();
    };

    const onStderr = (chunk) => {
      output += chunk.toString();
      process.stderr.write(chunk);
      inspectOutput();
    };

    child.stdout.on("data", onStdout);
    child.stderr.on("data", onStderr);

    child.on("exit", (code) => {
      if (isDevLockConflict(output)) {
        finish({ status: "dev-lock-conflict" });
        return;
      }

      if (isAddrInUse(output)) {
        finish({ status: "port-busy" });
        return;
      }

      if (!settled) {
        finish({ status: "failed", code });
      }
    });

    const readyTimer = setTimeout(() => {
      finish({ status: "started", child });
    }, 5000);
  });
}

async function startDev() {
  for (let offset = 0; offset < maxAttempts; offset++) {
    const port = preferredPort + offset;

    for (let lockRetry = 0; lockRetry < 2; lockRetry++) {
      clearDevLock(process.cwd());
      const result = await attemptStart(port);

      if (result.status === "dev-lock-conflict") {
        continue;
      }

      if (result.status === "started") {
        if (offset > 0) {
          console.warn(`Port ${preferredPort} is in use. Starting Next.js on ${port} instead.`);
        }

        return result.child;
      }

      if (result.status === "port-busy") {
        break;
      }

      process.exit(result.code ?? 1);
    }
  }

  throw new Error(`No available port found near ${preferredPort}`);
}

const child = await startDev();

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

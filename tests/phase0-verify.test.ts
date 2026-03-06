import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

function run(cmd: string): string {
  return execSync(cmd, { cwd: ROOT, encoding: "utf-8", timeout: 120_000 });
}

describe("Phase 0 — Verify everything works", () => {
  it("pnpm build succeeds across all packages", () => {
    const output = run("pnpm build 2>&1");
    expect(output).toContain("3 successful, 3 total");
    expect(output).not.toContain("ERROR");
  });

  it("pnpm lint succeeds across all packages", () => {
    const output = run("pnpm lint 2>&1");
    expect(output).toContain("3 successful, 3 total");
    expect(output).not.toContain("ERROR");
  });

  it("web app dev server starts and responds with HTTP 200", () => {
    // Use port 3456 to avoid conflicts, run next dev directly
    const script = `
      cd apps/web
      PORT=3456 npx next dev --port 3456 &
      DEV_PID=$!
      for i in 1 2 3 4 5 6 7 8 9 10; do
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3456 2>/dev/null)
        if [ "$STATUS" = "200" ]; then
          echo "HTTP_STATUS=200"
          kill $DEV_PID 2>/dev/null
          wait $DEV_PID 2>/dev/null
          exit 0
        fi
        sleep 1
      done
      echo "DEV_SERVER_TIMEOUT"
      kill $DEV_PID 2>/dev/null
      wait $DEV_PID 2>/dev/null
      exit 1
    `;
    const output = execSync(script, {
      cwd: ROOT,
      encoding: "utf-8",
      timeout: 30_000,
      shell: "/bin/bash",
    });
    expect(output).toContain("HTTP_STATUS=200");
  });
});

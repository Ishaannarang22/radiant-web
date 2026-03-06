/**
 * Test: shared TypeScript config verification
 * Validates that root tsconfig.json exists and all sub-projects extend it
 */

import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

const ROOT = resolve(__dirname, "..")

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    process.exit(1)
  }
  console.log(`PASS: ${message}`)
}

// 1. Root tsconfig.json exists
const rootTsconfigPath = resolve(ROOT, "tsconfig.json")
assert(existsSync(rootTsconfigPath), "root tsconfig.json exists")

const rootTsconfig = JSON.parse(readFileSync(rootTsconfigPath, "utf8"))
const opts = rootTsconfig.compilerOptions

// 2. Root tsconfig has strict mode
assert(opts.strict === true, "root tsconfig has strict: true")

// 3. Root tsconfig has expected shared settings
assert(opts.target === "ES2017", "root tsconfig target is ES2017")
assert(opts.module === "esnext", "root tsconfig module is esnext")
assert(opts.moduleResolution === "bundler", "root tsconfig moduleResolution is bundler")
assert(opts.esModuleInterop === true, "root tsconfig has esModuleInterop")
assert(opts.isolatedModules === true, "root tsconfig has isolatedModules")
assert(opts.skipLibCheck === true, "root tsconfig has skipLibCheck")

// 4. Each sub-project extends root
const subProjects = [
  { name: "apps/web", path: "apps/web/tsconfig.json" },
  { name: "packages/db", path: "packages/db/tsconfig.json" },
  { name: "packages/scraper", path: "packages/scraper/tsconfig.json" },
]

for (const proj of subProjects) {
  const tsconfigPath = resolve(ROOT, proj.path)
  assert(existsSync(tsconfigPath), `${proj.name}/tsconfig.json exists`)
  const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf8"))
  assert(
    tsconfig.extends === "../../tsconfig.json",
    `${proj.name} extends root tsconfig`
  )
}

// 5. Web app has Next.js-specific settings
const webTsconfig = JSON.parse(
  readFileSync(resolve(ROOT, "apps/web/tsconfig.json"), "utf8")
)
assert(
  webTsconfig.compilerOptions.jsx === "react-jsx",
  "web app has jsx: react-jsx"
)
assert(
  webTsconfig.compilerOptions.paths?.["@/*"]?.[0] === "./*",
  "web app has @/* path alias"
)

console.log("\nAll shared TypeScript config tests passed!")

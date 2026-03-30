// Auto-format files after edits (prettier/ruff/rustfmt)
const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// prettier のパスを解決（npx を避けて高速化）
function findPrettier(filePath) {
  // プロジェクトローカルの node_modules/.bin/prettier を優先
  let dir = path.dirname(filePath);
  while (dir !== path.dirname(dir)) {
    const local = path.join(dir, "node_modules", ".bin", "prettier");
    if (fs.existsSync(local)) return local;
    dir = path.dirname(dir);
  }
  // グローバルにフォールバック
  try {
    return execFileSync("which", ["prettier"], {
      encoding: "utf8",
      stdio: "pipe",
    }).trim();
  } catch {
    return null;
  }
}

let d = "";
process.stdin.on("data", (c) => (d += c));
process.stdin.on("end", () => {
  const i = JSON.parse(d);
  const p = i.tool_input?.file_path || "";

  try {
    if (/\.(ts|tsx|js|jsx|json|css|md)$/.test(p)) {
      const prettierPath = findPrettier(p);
      if (prettierPath) {
        execFileSync(prettierPath, ["--write", p], {
          stdio: "pipe",
          timeout: 10000,
        });
      }
    } else if (/\.py$/.test(p)) {
      execFileSync("ruff", ["format", p], { stdio: "pipe", timeout: 10000 });
    } else if (/\.rs$/.test(p)) {
      execFileSync("rustfmt", [p], { stdio: "pipe", timeout: 10000 });
    }
  } catch (e) {
    if (e.status) {
      console.error(
        `[Hook] WARNING: Auto-format failed for ${p}: ${e.stderr?.toString().trim() || "unknown error"}`,
      );
    }
    // フォーマッタ未インストール時は無視
  }

  console.log(d);
});

#!/usr/bin/env node
/**
 * PreCompact Hook — コンテキスト圧縮前の状態保存
 *
 * 圧縮の発生をセッションファイルに記録し、
 * 重要な情報が失われたことを次回復元時に判断できるようにする。
 */

const path = require("path");
const fs = require("fs");
const os = require("os");

const SESSIONS_DIR = path.join(os.homedir(), ".claude", "session-data");

function getTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

function getDateTimeString() {
  const d = new Date();
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return `${date} ${getTimeString()}`;
}

async function main() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    process.exit(0);
    return;
  }

  // 圧縮ログに記録
  const logFile = path.join(SESSIONS_DIR, "compaction-log.txt");
  const timestamp = getDateTimeString();
  fs.appendFileSync(logFile, `[${timestamp}] Context compaction triggered\n`);

  // 最新のセッションファイルに圧縮マーカーを追記
  let entries;
  try {
    entries = fs.readdirSync(SESSIONS_DIR, { withFileTypes: true });
  } catch {
    process.exit(0);
    return;
  }

  let newest = null;
  let newestMtime = 0;
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith("-session.tmp")) continue;
    const fullPath = path.join(SESSIONS_DIR, entry.name);
    try {
      const stats = fs.statSync(fullPath);
      if (stats.mtimeMs > newestMtime) {
        newestMtime = stats.mtimeMs;
        newest = fullPath;
      }
    } catch {
      continue;
    }
  }

  if (newest) {
    const time = getTimeString();
    fs.appendFileSync(
      newest,
      `\n---\n**[Compaction occurred at ${time}]** - Context was summarized\n`,
    );
  }

  process.exit(0);
}

main().catch((err) => {
  process.stderr.write(`[PreCompact] Error: ${err.message}\n`);
  process.exit(0);
});

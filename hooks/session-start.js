#!/usr/bin/env node
/**
 * SessionStart Hook — 前回セッションの復元
 *
 * セッション開始時に ~/.claude/session-data/ から直近のセッションファイルを
 * 検索し、最適なものを additionalContext として注入する。
 *
 * マッチ優先順位:
 *   1. worktree（cwd）完全一致
 *   2. プロジェクト名一致
 *   3. 最新のセッションファイル（フォールバック）
 */

const path = require("path");
const fs = require("fs");
const os = require("os");

const SESSIONS_DIR = path.join(os.homedir(), ".claude", "session-data");
const MAX_AGE_DAYS = 7;
const RETENTION_DAYS = 30;

// --- ユーティリティ ---

function normalizePath(p) {
  try {
    return fs.realpathSync(p);
  } catch {
    return p;
  }
}

function getProjectName() {
  return path.basename(process.cwd());
}

// --- セッション検索 ---

function findRecentSessions() {
  if (!fs.existsSync(SESSIONS_DIR)) return [];

  const now = Date.now();
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  let entries;
  try {
    entries = fs.readdirSync(SESSIONS_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  const sessions = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith("-session.tmp")) continue;

    const fullPath = path.join(SESSIONS_DIR, entry.name);
    try {
      const stats = fs.statSync(fullPath);
      if (now - stats.mtimeMs <= maxAge) {
        sessions.push({ path: fullPath, mtime: stats.mtimeMs });
      }
    } catch {
      continue;
    }
  }

  // 新しい順にソート
  return sessions.sort((a, b) => b.mtime - a.mtime);
}

function selectBestSession(sessions, cwd, project) {
  if (sessions.length === 0) return null;

  const normalizedCwd = normalizePath(cwd);
  let projectMatch = null;
  let projectContent = null;

  for (const session of sessions) {
    let content;
    try {
      content = fs.readFileSync(session.path, "utf8");
    } catch {
      continue;
    }

    // worktree 完全一致（最優先）
    const worktreeMatch = content.match(/\*\*Worktree:\*\*\s*(.+)$/m);
    const sessionWorktree = worktreeMatch ? worktreeMatch[1].trim() : "";
    if (sessionWorktree && normalizePath(sessionWorktree) === normalizedCwd) {
      return { session, content, reason: "worktree" };
    }

    // プロジェクト名一致
    if (!projectMatch && project) {
      const projMatch = content.match(/\*\*Project:\*\*\s*(.+)$/m);
      const sessionProject = projMatch ? projMatch[1].trim() : "";
      if (sessionProject === project) {
        projectMatch = session;
        projectContent = content;
      }
    }
  }

  if (projectMatch) {
    return { session: projectMatch, content: projectContent, reason: "project" };
  }
  return null;
}

// --- 古いセッションの削除 ---

function pruneExpiredSessions() {
  if (!fs.existsSync(SESSIONS_DIR)) return;

  const now = Date.now();
  const maxAge = RETENTION_DAYS * 24 * 60 * 60 * 1000;

  let entries;
  try {
    entries = fs.readdirSync(SESSIONS_DIR, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith("-session.tmp")) continue;
    const fullPath = path.join(SESSIONS_DIR, entry.name);
    try {
      const stats = fs.statSync(fullPath);
      if (now - stats.mtimeMs > maxAge) {
        fs.rmSync(fullPath, { force: true });
      }
    } catch {
      continue;
    }
  }
}

// --- メイン ---

async function main() {
  // 期限切れセッションの削除
  pruneExpiredSessions();

  const sessions = findRecentSessions();
  if (sessions.length === 0) {
    process.exit(0);
    return;
  }

  const cwd = process.cwd();
  const project = getProjectName();
  const result = selectBestSession(sessions, cwd, project);

  if (!result) {
    process.exit(0);
    return;
  }

  const { content, reason } = result;

  // テンプレート状態のセッションは注入しない
  if (content.includes("[Session context goes here]")) {
    process.exit(0);
    return;
  }

  process.stderr.write(
    `[SessionStart] 前回セッションを復元 (match: ${reason})\n`,
  );

  const payload = JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: `Previous session summary:\n${content}`,
    },
  });

  process.stdout.write(payload);
}

main().catch((err) => {
  process.stderr.write(`[SessionStart] Error: ${err.message}\n`);
  process.exitCode = 0;
});

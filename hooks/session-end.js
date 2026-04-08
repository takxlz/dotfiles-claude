#!/usr/bin/env node
/**
 * Stop Hook — セッション情報の自動保存
 *
 * 毎応答後に実行され、トランスクリプトからサマリを抽出して
 * ~/.claude/session-data/ にセッションファイルとして保存する。
 */

const path = require("path");
const fs = require("fs");
const os = require("os");

const SESSIONS_DIR = path.join(os.homedir(), ".claude", "session-data");
const SUMMARY_START = "<!-- SESSION:SUMMARY:START -->";
const SUMMARY_END = "<!-- SESSION:SUMMARY:END -->";

// --- ユーティリティ ---

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

function getSessionId() {
  // CLAUDE_SESSION_ID の先頭8文字、なければタイムスタンプ
  const id = process.env.CLAUDE_SESSION_ID || "";
  return id ? id.slice(0, 8) : Date.now().toString(36);
}

function getProjectName() {
  const cwd = process.cwd();
  return path.basename(cwd);
}

function getGitBranch() {
  try {
    return require("child_process")
      .execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" })
      .trim();
  } catch {
    return "unknown";
  }
}

function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
}

// --- トランスクリプト解析 ---

function extractSummary(transcriptPath) {
  let content;
  try {
    content = fs.readFileSync(transcriptPath, "utf8");
  } catch {
    return null;
  }

  const lines = content.split("\n").filter(Boolean);
  const userMessages = [];
  const toolsUsed = new Set();
  const filesModified = new Set();

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);

      // ユーザーメッセージ
      if (
        entry.type === "user" ||
        entry.role === "user" ||
        entry.message?.role === "user"
      ) {
        const raw = entry.message?.content ?? entry.content;
        const text =
          typeof raw === "string"
            ? raw
            : Array.isArray(raw)
              ? raw.map((c) => c?.text || "").join(" ")
              : "";
        const cleaned = stripAnsi(text).trim();
        if (cleaned) userMessages.push(cleaned.slice(0, 200));
      }

      // ツール使用（直接）
      if (entry.type === "tool_use" || entry.tool_name) {
        const name = entry.tool_name || entry.name || "";
        if (name) toolsUsed.add(name);
        const fp =
          entry.tool_input?.file_path || entry.input?.file_path || "";
        if (fp && (name === "Edit" || name === "Write"))
          filesModified.add(fp);
      }

      // ツール使用（assistant メッセージ内）
      if (
        entry.type === "assistant" &&
        Array.isArray(entry.message?.content)
      ) {
        for (const block of entry.message.content) {
          if (block.type === "tool_use") {
            const name = block.name || "";
            if (name) toolsUsed.add(name);
            const fp = block.input?.file_path || "";
            if (fp && (name === "Edit" || name === "Write"))
              filesModified.add(fp);
          }
        }
      }
    } catch {
      // パース失敗行はスキップ
    }
  }

  if (userMessages.length === 0) return null;

  return {
    userMessages: userMessages.slice(-10),
    toolsUsed: Array.from(toolsUsed).slice(0, 20),
    filesModified: Array.from(filesModified).slice(0, 30),
    totalMessages: userMessages.length,
  };
}

// --- セッションファイル構築 ---

function buildHeader(today, time, meta, existing = "") {
  const heading =
    existing.match(/^#\s+.+$/m)?.[0] || `# Session: ${today}`;
  const started =
    existing.match(/\*\*Started:\*\*\s*(.+)$/m)?.[1]?.trim() || time;

  return [
    heading,
    `**Date:** ${today}`,
    `**Started:** ${started}`,
    `**Last Updated:** ${time}`,
    `**Project:** ${meta.project}`,
    `**Branch:** ${meta.branch}`,
    `**Worktree:** ${meta.worktree}`,
    "",
  ].join("\n");
}

function buildSummaryBlock(summary) {
  let section = "## Session Summary\n\n";

  section += "### Tasks\n";
  for (const msg of summary.userMessages) {
    section += `- ${msg.replace(/\n/g, " ").replace(/`/g, "\\`")}\n`;
  }
  section += "\n";

  if (summary.filesModified.length > 0) {
    section += "### Files Modified\n";
    for (const f of summary.filesModified) {
      section += `- ${f}\n`;
    }
    section += "\n";
  }

  if (summary.toolsUsed.length > 0) {
    section += `### Tools Used\n${summary.toolsUsed.join(", ")}\n\n`;
  }

  section += `### Stats\n- Total user messages: ${summary.totalMessages}\n`;

  return `${SUMMARY_START}\n${section.trim()}\n${SUMMARY_END}`;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- メイン ---

let stdinData = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  if (stdinData.length < 1024 * 1024) stdinData += chunk;
});
process.stdin.on("end", () => {
  main().catch((err) => {
    process.stderr.write(`[SessionEnd] Error: ${err.message}\n`);
    process.exit(0);
  });
});

async function main() {
  // トランスクリプトパスを取得
  let transcriptPath = null;
  try {
    transcriptPath = JSON.parse(stdinData).transcript_path;
  } catch {
    transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;
  }

  const today = getDateString();
  const time = getTimeString();
  const shortId = getSessionId();
  const sessionFile = path.join(SESSIONS_DIR, `${today}-${shortId}-session.tmp`);
  const meta = {
    project: getProjectName(),
    branch: getGitBranch(),
    worktree: process.cwd(),
  };

  ensureDir(SESSIONS_DIR);

  // トランスクリプトからサマリを抽出
  let summary = null;
  if (transcriptPath && fs.existsSync(transcriptPath)) {
    summary = extractSummary(transcriptPath);
  }

  const SEP = "\n---\n";

  if (fs.existsSync(sessionFile)) {
    // 既存ファイルを更新
    let content = fs.readFileSync(sessionFile, "utf8");

    // ヘッダーを更新
    const sepIdx = content.indexOf(SEP);
    if (sepIdx !== -1) {
      const existingHeader = content.slice(0, sepIdx);
      const body = content.slice(sepIdx + SEP.length);
      content = `${buildHeader(today, time, meta, existingHeader)}${SEP}${body}`;
    }

    // サマリブロックを更新
    if (summary) {
      const block = buildSummaryBlock(summary);
      if (
        content.includes(SUMMARY_START) &&
        content.includes(SUMMARY_END)
      ) {
        content = content.replace(
          new RegExp(
            `${escapeRegExp(SUMMARY_START)}[\\s\\S]*?${escapeRegExp(SUMMARY_END)}`,
          ),
          block,
        );
      } else {
        content += `\n${block}\n`;
      }
    }

    fs.writeFileSync(sessionFile, content, "utf8");
  } else {
    // 新規作成
    const summarySection = summary
      ? buildSummaryBlock(summary)
      : "## Current State\n\n[Session context goes here]";

    const template = `${buildHeader(today, time, meta)}${SEP}${summarySection}\n`;
    fs.writeFileSync(sessionFile, template, "utf8");
  }

  process.exit(0);
}

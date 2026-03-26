# dotfiles-claude

Claude Code の設定ファイル（スキル、エージェント、ルール、フック等）を管理するリポジトリ。

## 構成

```
.
├── CLAUDE.md            # このリポジトリ用の設定
├── CLAUDE-global.md     # 全プロジェクト共通の指示 → ~/.claude/CLAUDE.md
├── settings.json        # グローバル設定（hooks 含む） → ~/.claude/settings.json
├── agents/              # カスタムエージェント（16個） → ~/.claude/agents/
├── skills/              # カスタムスキル（17個） → ~/.claude/skills/
├── rules/               # カスタムルール（5個） → ~/.claude/rules/
├── hooks/               # hook スクリプト（4個） → ~/.claude/hooks/
├── setup.sh             # セットアップ（macOS / Linux）
├── setup.bat            # セットアップ（Windows）
└── .gitignore
```

## セットアップ

### macOS / Linux

```bash
chmod +x setup.sh
./setup.sh
```

### Windows

管理者権限のコマンドプロンプトで実行:

```cmd
setup.bat
```

`~/.claude/` 配下にシンボリックリンクを作成する。既存ファイルは `.bak.*` としてバックアップされる。

## 含まれるもの

### エージェント（16個）

**汎用:** planner, code-reviewer, security-reviewer, build-error-resolver, refactor-cleaner, tdd-guide, architect, doc-updater, docs-lookup, database-reviewer

**言語別:** typescript-reviewer, rust-reviewer, rust-build-resolver, java-reviewer, java-build-resolver, python-reviewer

### スキル（17個）

note, security-review, tdd-workflow, python-patterns, springboot-patterns, rust-patterns, postgres-patterns, python-testing, rust-testing, coding-standards, api-design, backend-patterns, frontend-patterns, database-migrations, java-coding-standards, deep-research, codebase-onboarding

### ルール（5個）

guardrails, typescript-coding-style, typescript-testing, python-coding-style, python-testing

### Hooks（4スクリプト + 1インライン）

block-no-verify, block-large-file, warn-console-log, auto-format, デスクトップ通知（macOS）

## License

This repository includes agents, skills, and rules from [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa, licensed under the [MIT License](https://github.com/affaan-m/everything-claude-code/blob/main/LICENSE).

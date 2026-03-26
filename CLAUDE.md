# dotfiles-claude

Claude Code の設定ファイル（スキル、エージェント、ルール、フック等）を管理するリポジトリ。

## 構成

- `CLAUDE-global.md` — 全プロジェクト共通の指示（`~/.claude/CLAUDE.md` にリンク）
- `settings.json` — グローバル設定（`~/.claude/settings.json` にリンク）
- `skills/` — カスタムスキル（`~/.claude/skills/` にリンク）
- `agents/` — カスタムエージェント（`~/.claude/agents/` にリンク）
- `rules/` — カスタムルール（`~/.claude/rules/` にリンク）
- `hooks/` — hook スクリプト（`~/.claude/hooks/` にリンク）
- `setup.sh` — セットアップスクリプト（macOS / Linux）
- `setup.bat` — セットアップスクリプト（Windows）

## エージェント

### 汎用

| エージェント | 用途 |
|---|---|
| `planner` | 複雑な機能やリファクタリングの実装計画を策定する |
| `code-reviewer` | コード品質・セキュリティ・保守性のレビュー |
| `security-reviewer` | OWASP Top 10 等のセキュリティ脆弱性検出 |
| `build-error-resolver` | ビルド/型エラーを最小限の変更で解決する |
| `refactor-cleaner` | 不要コード・重複コードの検出と削除 |
| `tdd-guide` | テスト駆動開発（Red-Green-Refactor）のガイド |
| `architect` | システム設計・スケーラビリティ・技術的意思決定 |
| `doc-updater` | ドキュメント・コードマップの更新 |
| `docs-lookup` | ライブラリ・フレームワーク・API のドキュメント調査 |
| `database-reviewer` | PostgreSQL のクエリ最適化・スキーマ設計・セキュリティ |

### 言語別

| エージェント | 対象言語 |
|---|---|
| `typescript-reviewer` | TypeScript / JavaScript |
| `rust-reviewer` | Rust |
| `rust-build-resolver` | Rust ビルドエラー |
| `java-reviewer` | Java / Spring Boot |
| `java-build-resolver` | Java / Maven / Gradle ビルドエラー |
| `python-reviewer` | Python |

## スキル

| スキル | 用途 | 参照元エージェント |
|---|---|---|
| `note` | 会話の知見をナレッジノートとしてマークダウンに出力する | — |
| `security-review` | セキュリティ脆弱性パターン・レポートテンプレート | `security-reviewer` |
| `tdd-workflow` | TDD の詳細なモッキングパターン・フレームワーク別例 | `tdd-guide` |
| `python-patterns` | Python の設計パターン・アンチパターン | `python-reviewer` |
| `springboot-patterns` | Spring Boot / Java の設計パターン | `java-reviewer`, `java-build-resolver` |
| `rust-patterns` | Rust のエラーパターン・コード例 | `rust-reviewer`, `rust-build-resolver` |
| `python-testing` | Python テストパターン（pytest等） | — |
| `rust-testing` | Rust テストパターン | — |
| `coding-standards` | 汎用コーディング規約 | — |
| `api-design` | API 設計パターン | — |
| `backend-patterns` | バックエンド設計パターン | — |
| `frontend-patterns` | フロントエンド設計パターン | — |
| `database-migrations` | DB マイグレーション | — |
| `java-coding-standards` | Java コーディング規約 | — |
| `deep-research` | 深掘り調査 | — |
| `codebase-onboarding` | コードベース理解支援 | — |
| `postgres-patterns` | PostgreSQL インデックス・スキーマ設計・接続管理 | `database-reviewer` |

## ルール

| ルール | 用途 | パススコープ |
|---|---|---|
| `guardrails` | コミット規約（Conventional Commits）、コードスタイル、テストレイアウト | なし（常時適用） |
| `typescript-coding-style` | TypeScript / JavaScript コーディング規約 | `**/*.ts,tsx,js,jsx` |
| `typescript-testing` | TypeScript / JavaScript テスト規約 | `**/*.ts,tsx,js,jsx` |
| `python-coding-style` | Python コーディング規約 | `**/*.py,pyi` |
| `python-testing` | Python テスト規約 | `**/*.py,pyi` |

## Hooks

`settings.json` 内で定義。スクリプト本体は `hooks/` に配置。

### PreToolUse（ツール実行前）

| hook | 対象 | 動作 |
|---|---|---|
| `block-no-verify.js` | Bash | `--no-verify` を含むコマンドをブロック |
| `block-large-file.js` | Write | 800行超のファイル作成をブロック |

### PostToolUse（ツール実行後）

| hook | 対象 | 動作 |
|---|---|---|
| `warn-console-log.js` | Edit | `console.log` の追加を警告 |
| `auto-format.js` | Edit | prettier / ruff / rustfmt で自動フォーマット |

### Stop（応答完了時）

| hook | 動作 |
|---|---|
| デスクトップ通知 | macOS 通知で完了を知らせる（インライン定義） |

## 注意事項

- `setup.sh`（macOS/Linux）または `setup.bat`（Windows）を実行すると `~/.claude/` 配下にシンボリックリンクが作成される
- 既存ファイルは `.bak.*` としてバックアップされる
- Windows ではシンボリックリンク作成に管理者権限または開発者モードが必要

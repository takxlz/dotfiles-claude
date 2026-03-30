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

| エージェント           | モデル | 用途                                                                  |
| ---------------------- | ------ | --------------------------------------------------------------------- |
| `planner`              | Opus   | 複雑な機能やリファクタリングの実装計画を策定する                      |
| `architect`            | Opus   | システム設計・スケーラビリティ・技術的意思決定                        |
| `code-reviewer`        | Opus   | コード変更後のレビュー（別コンテキストでバイアスを排除）              |
| `build-error-resolver` | Opus   | 全言語のビルド/型エラーを最小限の変更で解決する（借用チェッカー含む） |
| `security-reviewer`    | Opus   | OWASP Top 10 等のセキュリティ脆弱性検出・監査                         |

## スキル

### 言語別パターン

| スキル                | 用途                                               |
| --------------------- | -------------------------------------------------- |
| `coding-patterns`     | 汎用コーディング原則（KISS/DRY/YAGNI）             |
| `typescript-patterns` | TS/JS/React の型安全性・非同期・コンポーネント設計 |
| `python-patterns`     | Python の設計パターン・アンチパターン              |
| `rust-patterns`       | Rust のエラーパターン・所有権・並行処理            |

### テスト

| スキル           | 用途                                        |
| ---------------- | ------------------------------------------- |
| `tdd-workflow`   | TDD の Red→Green→Refactor ワークフロー      |
| `python-testing` | pytest フィクスチャ・パラメトライズ・モック |
| `rust-testing`   | cargo test・proptest・mockall・Criterion    |

### API・バックエンド・フロントエンド

| スキル              | 用途                                                                      |
| ------------------- | ------------------------------------------------------------------------- |
| `api-design`        | REST API 設計パターン（リソース命名・ステータスコード・ページネーション） |
| `backend-patterns`  | リポジトリパターン・サービス層・N+1 防止・キャッシュ（Node.js）           |
| `frontend-patterns` | React コンポーネント設計・カスタムフック・状態管理・パフォーマンス        |

### データベース

| スキル                | 用途                                                       |
| --------------------- | ---------------------------------------------------------- |
| `postgres-patterns`   | PostgreSQL インデックス設計・RLS・カーソルページネーション |
| `database-migrations` | ゼロダウンタイムスキーマ変更（Prisma/Drizzle/Django 等）   |

### セキュリティ・その他

| スキル            | 用途                                                 |
| ----------------- | ---------------------------------------------------- |
| `security-review` | セキュリティ脆弱性パターン・デプロイ前チェックリスト |
| `note`            | 会話の知見をマークダウンに出力（`/note` で起動）     |

## ルール

| ルール       | 用途                                                                            | パススコープ         |
| ------------ | ------------------------------------------------------------------------------- | -------------------- |
| `guardrails` | Conventional Commits、TDD、コードレビュー方針、コードスタイル、テストレイアウト | なし（常時適用）     |
| `typescript` | TypeScript / JavaScript コーディング規約 + テスト規約                           | `**/*.ts,tsx,js,jsx` |
| `python`     | Python コーディング規約 + テスト規約                                            | `**/*.py,pyi`        |
| `rust`       | Rust コーディング規約 + テスト規約                                              | `**/*.rs`            |
| `markdown`   | Markdown フォーマット規約（テーブル整形等）                                     | `**/*.md`            |

## Hooks

`settings.json` 内で定義。スクリプト本体は `hooks/` に配置。

### PreToolUse（ツール実行前）

| hook                           | 対象  | 動作                                                         |
| ------------------------------ | ----- | ------------------------------------------------------------ |
| `block-no-verify.js`           | Bash  | `--no-verify` を含むコマンドをブロック                       |
| `block-destructive-git.js`     | Bash  | `push --force` / `reset --hard` 等の破壊的コマンドをブロック |
| `check-conventional-commit.js` | Bash  | コミットメッセージの Conventional Commits 形式を検証         |
| `block-large-file.js`          | Write | 800行超のファイル作成をブロック                              |

### PostToolUse（ツール実行後）

| hook                  | 対象 | 動作                                         |
| --------------------- | ---- | -------------------------------------------- |
| `warn-console-log.js` | Edit | `console.log` の追加を警告                   |
| `auto-format.js`      | Edit | prettier / ruff / rustfmt で自動フォーマット |

### Stop（応答完了時）

| hook             | 動作                                         |
| ---------------- | -------------------------------------------- |
| デスクトップ通知 | macOS 通知で完了を知らせる（インライン定義） |

## 注意事項

- `setup.sh`（macOS/Linux）または `setup.bat`（Windows）を実行すると `~/.claude/` 配下にシンボリックリンクが作成される
- 既存ファイルは `.bak.*` としてバックアップされる
- Windows ではシンボリックリンク作成に管理者権限または開発者モードが必要

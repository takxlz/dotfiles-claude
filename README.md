# dotfiles-claude

Claude Code の設定ファイル（スキル、エージェント、ルール、フック等）を管理するリポジトリ。

## 構成

```
.
├── CLAUDE.md            # このリポジトリ用の設定
├── CLAUDE-global.md     # 全プロジェクト共通の指示 → ~/.claude/CLAUDE.md
├── settings.json        # グローバル設定（hooks 含む） → ~/.claude/settings.json
├── agents/              # カスタムエージェント（4個） → ~/.claude/agents/
├── skills/              # カスタムスキル（15個） → ~/.claude/skills/
├── rules/               # カスタムルール（10個） → ~/.claude/rules/
├── hooks/               # hook スクリプト（6個） → ~/.claude/hooks/
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

## 設計方針

メインエージェント（Opus）が実装・レビュー・テスト・ドキュメントを直接担当する。サブエージェントは「別コンテキストで深く考える」「反復ループを隔離する」「専門チェックリストで網羅性を担保する」場合にのみ使用する。

- **ルール**（自動適用）がコーディング規約を常時適用
- **スキル**（オンデマンド）が詳細なパターン集を提供
- **エージェント**（最小限）が本当に必要な場面だけ起動

## 含まれるもの

### エージェント（4個）

| エージェント           | モデル | 用途                                                              |
| ---------------------- | ------ | ----------------------------------------------------------------- |
| `planner`              | Opus   | 複雑な機能やリファクタリングの実装計画を策定                      |
| `architect`            | Opus   | システム設計・スケーラビリティ・技術的意思決定                    |
| `build-error-resolver` | Opus   | 全言語のビルド/型エラーを最小限の差分で修正（借用チェッカー含む） |
| `security-reviewer`    | Opus   | OWASP Top 10・秘密情報・認証の脆弱性を検出・監査                  |

### スキル（15個）

#### 開発プロセス

- **coding-patterns** — 言語非依存の汎用原則（KISS / DRY / YAGNI）
- **tdd-workflow** — TDD の Red→Green→Refactor、モッキングパターン、フレームワーク別例
- **security-review** — 15項目のセキュリティチェックリスト、SQLi/XSS/CSRF 防止パターン

#### API・バックエンド・フロントエンド

- **api-design** — REST API 設計パターン（リソース命名・ページネーション・バージョニング）
- **backend-patterns** — リポジトリパターン・サービス層・N+1 防止・キャッシュ（Node.js）
- **frontend-patterns** — React コンポーネント設計・カスタムフック・状態管理・パフォーマンス

#### データベース

- **postgres-patterns** — PostgreSQL インデックス設計・RLS・カーソルページネーション
- **database-migrations** — ゼロダウンタイムスキーマ変更（Prisma / Drizzle / Django 等）

#### 言語別パターン

- **typescript-patterns** — TS/JS の型安全性・非同期・React コンポーネント・Zod 入力検証
- **python-patterns** — EAFP 原則・型ヒント・データクラス・並行処理パターン
- **python-testing** — pytest フィクスチャ・パラメトライズ・非同期テスト・カバレッジ 80%+
- **rust-patterns** — 所有権・借用・エラー処理（thiserror / anyhow）・並行処理
- **rust-testing** — cargo test・proptest・mockall・Criterion ベンチマーク
- **java-patterns** — Java 17+ 規約 + Spring Boot 設計パターン + Workflow/State Machine

#### ユーティリティ

- **note** — 会話の知見をマークダウンに出力（`/note` で起動）

### ルール（10個）

- **guardrails**（常時適用）
  - Conventional Commits 形式、TDD（テストファースト）、コードレビュー方針
  - 既存のモジュール構成を維持、camelCase ファイル命名
- **typescript-coding-style**（`**/*.ts,tsx,js,jsx`）
  - スプレッド演算子による不変更新、async/await + try-catch
  - Zod スキーマ入力検証、console.log 禁止
- **typescript-testing**（`**/*.ts,tsx,js,jsx`）
  - Jest / Vitest、`*.test.ts` / `*.spec.ts`、E2E は Playwright
- **python-coding-style**（`**/*.py,pyi`）
  - PEP 8、全関数に型アノテーション、frozen dataclass / NamedTuple
- **python-testing**（`**/*.py,pyi`）
  - pytest、`pytest.mark` でカテゴリ分け
- **rust-coding-style**（`**/*.rs`）
  - `?` 演算子、借用優先、`unsafe` 最小限 + `// SAFETY:`
- **rust-testing**（`**/*.rs`）
  - cargo test、`#[cfg(test)]`、`tests/` で統合テスト
- **java-coding-style**（`**/*.java`）
  - Java 17+（records, sealed classes）、Optional、Controller → Service → Repository
- **java-testing**（`**/*.java`）
  - JUnit 5 + Mockito、`@SpringBootTest` + `MockMvc`
- **markdown-style**（`**/*.md`）
  - テーブル `|` 整形、最小セパレータ禁止

### Hooks（6スクリプト + 1インライン）

#### PreToolUse（ツール実行前）

- **block-no-verify**（Bash）— `--no-verify` をブロック
- **block-destructive-git**（Bash）— `push --force` / `reset --hard` 等をブロック（`--force-with-lease` は許可）
- **check-conventional-commit**（Bash）— コミットメッセージの Conventional Commits 形式を検証
- **block-large-file**（Write）— 800行超のファイル作成をブロック

#### PostToolUse（ツール実行後）

- **warn-console-log**（Edit）— `console.log` 追加を警告
- **auto-format**（Edit）— prettier / ruff / rustfmt で自動フォーマット

#### Stop（応答完了時）

- **デスクトップ通知**（インライン）— macOS 通知で完了を知らせる

## License

This repository includes agents, skills, and rules from [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa, licensed under the [MIT License](https://github.com/affaan-m/everything-claude-code/blob/main/LICENSE).

# dotfiles-claude

Claude Code の設定ファイル（スキル、エージェント、ルール、フック等）を管理するリポジトリ。

## 構成

- `CLAUDE-global.md` — 全プロジェクト共通の指示（`~/.claude/CLAUDE.md` にリンク）
- `settings.json` — グローバル設定（`~/.claude/settings.json` にリンク）
- `skills/` — カスタムスキル（`~/.claude/skills/` にリンク）
- `agents/` — カスタムエージェント（`~/.claude/agents/` にリンク）
- `rules/` — カスタムルール（`~/.claude/rules/` にリンク）
- `hooks/` — hook スクリプト（`~/.claude/hooks/` にリンク）
- `docs/` — 設計ドキュメント
- `setup.sh` — セットアップスクリプト（macOS / Linux）
- `setup.bat` — セットアップスクリプト（Windows）

## 設計ドキュメント

| ドキュメント                                             | 概要                                                   |
| -------------------------------------------------------- | ------------------------------------------------------ |
| [`docs/design-skills-vs-agents.md`](docs/design-skills-vs-agents.md) | Skill と Agent の使い分け設計指針（関数/クラス パターン） |

## エージェント

なし（今後必要に応じて追加）

## スキル

| スキル           | 概要                                                     |
| ---------------- | -------------------------------------------------------- |
| `triage-errors`  | 指定された機能IDのスタックトレースをログから取得する     |
| `review-code`    | コード変更を別コンテキストでレビューする                 |
| `note`           | 会話中の知見をmarkdownファイルとして保存する             |
| `find-skills`    | スキルの検索・インストールを支援する                     |

## ルール

| ルール       | 対象       | 概要                                           |
| ------------ | ---------- | ---------------------------------------------- |
| `markdown`   | `**/*.md`  | テーブル列揃え、見出し階層、行長の書式ルール   |

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

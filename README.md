# dotfiles-claude

Claude Code の設定ファイル（スキル、ルール、フック等）を管理するリポジトリ。
`setup.sh` を実行すると `~/.claude/` 配下にシンボリックリンクが作成され、すべての Claude Code プロジェクトに反映される。

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

既存ファイルは `.bak.*` としてバックアップされる。
Windows ではシンボリックリンク作成に管理者権限または開発者モードが必要。

## ディレクトリ構成

```
.
├── CLAUDE.md            # このリポジトリ用の指示
├── CLAUDE-global.md     # 全プロジェクト共通の指示 → ~/.claude/CLAUDE.md
├── settings.json        # グローバル設定（hooks 含む） → ~/.claude/settings.json
├── skills/              # カスタムスキル → ~/.claude/skills/
├── agents/              # カスタムエージェント → ~/.claude/agents/
├── rules/               # カスタムルール → ~/.claude/rules/
├── hooks/               # hook スクリプト → ~/.claude/hooks/
├── tmp/                 # 刷新前の旧定義（参考用）
├── setup.sh             # セットアップ（macOS / Linux）
├── setup.bat            # セットアップ（Windows）
└── .gitignore
```

## グローバル指示（CLAUDE-global.md）

全プロジェクトに適用される共通ルール:

- **応答言語** — 日本語で応答。変数名・関数名・コミットメッセージは英語
- **確認なしに実行しない** — 質問や選択肢への問い合わせは承認ではない。明示的な許可があるまで待つ
- **エラー修正時のスコープ制約** — 最小限の修正のみ。リファクタリング・アーキテクチャ変更・「ついで」の整理は行わない
- **コード変更時のドキュメント更新** — README、CLAUDE.md、APIドキュメント、コメント等を変更に合わせて更新する

## エージェント

### code-reviewer — コードレビュー

コード変更を品質・セキュリティ・保守性の観点でレビューする。

- 専用のシステムプロンプトで動作し、実装時のバイアスを排除
- ツールは `Read`, `Grep`, `Glob`, `Bash` に制限（変更は行わない）
- 確信度80%以上の指摘のみ報告
- 重要度順に優先: CRITICAL（セキュリティ、データ損失）→ HIGH（バグ）→ MEDIUM（品質）→ LOW（スタイル）

## スキル

### triage-errors — エラートリアージ

指定された機能IDをもとに、Java アプリケーションのログから該当するスタックトレースを取得する。

- ユーザーからログディレクトリ・AP種別・機能IDを受け取る
- ERROR レベルのエントリからスタックトレースを完全に抽出（`Caused by` チェーン含む）
- 結果は `./triage-output/errors-YYYYMMDD-HHMMSS.md` にファイル出力
- AP種別とファイル名パターンの対応は `config.local.md`（gitignore 対象）に記載

初回セットアップ:

```bash
cd skills/triage-errors
cp config.example.md config.local.md
# config.local.md を自社環境に合わせて編集
```

### note — ナレッジノート生成

会話中に得た知見をmarkdownファイルとして保存する。

- `/note` または「メモして」「まとめて」等で起動
- カテゴリ別テンプレート: 技術調査 / トラブルシューティング / 設計判断 / 学び
- 出力先: `./note/`（作業ディレクトリ直下）
- 既存ファイルとの重複チェック・追記にも対応

### find-skills — スキル検索

`npx skills` CLI を使ってスキルの検索・インストールを支援する。

## ルール

### markdown（`**/*.md`）

Markdown ファイル編集時に自動適用される書式ルール:

- テーブルの `|` 列をパディングで揃える（日本語全角幅を考慮）
- 最小セパレータ（`|---|---|`）は使わない
- 見出しは `#` と `##` を主に使い、`####` 以降は使わない

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

## ローカル設定

以下のファイルは gitignore されており、環境ごとにローカルで作成する:

- `*.local.md` — スキルのローカル設定（機密情報を含む）
- `settings.local.json` — Claude Code のローカル設定オーバーライド


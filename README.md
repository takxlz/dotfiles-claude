# dotfiles-claude

Claude Code の設定ファイル管理リポジトリ。

## ディレクトリ構成

```
.
├── settings.json    # Claude Code グローバル設定
├── skills/          # カスタムスキル (SKILL.md)
│   └── note/        # ナレッジノート生成スキル
├── agents/          # カスタムエージェント定義
├── rules/           # カスタムルール
├── hooks/           # フック設定
├── setup.sh         # セットアップスクリプト
└── .gitignore
```

## セットアップ

```bash
chmod +x setup.sh
./setup.sh
```

`~/.claude/` 配下にシンボリックリンクを作成する。既存ファイルは `.bak.*` としてバックアップされる。

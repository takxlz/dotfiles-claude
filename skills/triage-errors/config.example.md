# triage-errors ローカル設定

このファイルを `config.local.md` にコピーして、自社環境に合わせて記入してください。
`config.local.md` は gitignore されているためコミットされません。

```
cp config.example.md config.local.md
```

## AP種別の定義

ログファイル名の特定に使用する。AP種別ごとにセクションを作成する。

### （例）web

- ファイル名パターン: `web-application.log*`
- ログフォーマット: テキスト（`YYYY-MM-DD HH:mm:ss.SSS [LEVEL] module - message`）

### （例）batch

- ファイル名パターン: `batch-process.log*`
- ログフォーマット: JSON（`{"timestamp": "...", "level": "...", "module": "...", "message": "..."}`）

## 無視すべき既知パターン

既知で対応不要なエラーパターンを記載。

- （例）`Connection reset by peer` — 一時的なネットワーク断で自動復旧

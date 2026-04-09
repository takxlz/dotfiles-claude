---
description: "ブランチ運用、コミット粒度、PR 作成手順に関するルール"
---

# Git ワークフロー

## ブランチ

- `main` に直接コミットせず、機能ブランチで作業する
- ブランチ名: `<type>/<short-description>`（例: `feat/add-auth`, `fix/null-check`）

## コミット

- 1つのコミットに1つの論理的変更をまとめる
- 無関係な変更を混ぜない（リファクタリングと機能追加は別コミット）
- `git add .` ではなくファイルを明示的に指定する
- Conventional Commits の型: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

## プルリクエスト

- 最新コミットだけでなく、全コミット履歴を分析して PR を作成する
- `git diff <base-branch>...HEAD` で全変更を確認する
- タイトルは70文字以内、詳細は本文に書く

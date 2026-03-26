#!/bin/bash
# Claude Code dotfiles セットアップスクリプト
# ~/.claude/ 配下にシンボリックリンクを作成する

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

# リンク対象の定義 (ソース:デスティネーション)
declare -a LINKS=(
  "CLAUDE-global.md:CLAUDE.md"
  "settings.json:settings.json"
  "skills:skills"
  "agents:agents"
  "rules:rules"
  "hooks:hooks"
)

for entry in "${LINKS[@]}"; do
  src="${SCRIPT_DIR}/${entry%%:*}"
  dst="${CLAUDE_DIR}/${entry##*:}"

  if [ ! -e "$src" ]; then
    echo "SKIP: $src が存在しません"
    continue
  fi

  # 既存のファイル/ディレクトリをバックアップ
  if [ -e "$dst" ] && [ ! -L "$dst" ]; then
    backup="${dst}.bak.$(date +%Y%m%d%H%M%S)"
    echo "BACKUP: $dst -> $backup"
    mv "$dst" "$backup"
  elif [ -L "$dst" ]; then
    echo "REMOVE: 既存のシンボリックリンク $dst"
    rm "$dst"
  fi

  echo "LINK: $src -> $dst"
  ln -s "$src" "$dst"
done

echo ""
echo "セットアップ完了"

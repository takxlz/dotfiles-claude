#!/bin/bash
# Claude Code dotfiles セットアップスクリプト
# ~/.claude/ 配下にシンボリックリンクを作成する

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

# ディレクトリ全体をリンクする対象（ソース:デスティネーション）
declare -a LINKS=(
  "CLAUDE-global.md:CLAUDE.md"
  "settings.json:settings.json"
  "agents:agents"
  "rules:rules"
  "hooks:hooks"
)

# skills は個別リンクで管理する対象（skills CLI 等との共存のため）
# $SCRIPT_DIR/skills 配下の各ディレクトリを個別に ~/.claude/skills/ へリンクする
SKILLS_SRC_DIR="${SCRIPT_DIR}/skills"
SKILLS_DST_DIR="${CLAUDE_DIR}/skills"

mkdir -p "$CLAUDE_DIR"

# ディレクトリ全体のリンク処理
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

# skills の個別リンク処理
if [ -d "$SKILLS_SRC_DIR" ]; then
  # 既存の ~/.claude/skills がシンボリックリンクの場合は削除（旧構成からの移行）
  if [ -L "$SKILLS_DST_DIR" ]; then
    echo "REMOVE: 既存のシンボリックリンク ${SKILLS_DST_DIR}（旧構成）"
    rm "$SKILLS_DST_DIR"
  fi

  # ~/.claude/skills/ を実ディレクトリとして作成
  mkdir -p "$SKILLS_DST_DIR"

  # skills/ 配下の各ディレクトリを個別にリンク
  for skill_src in "$SKILLS_SRC_DIR"/*/; do
    [ -d "$skill_src" ] || continue
    skill_name="$(basename "$skill_src")"
    skill_dst="${SKILLS_DST_DIR}/${skill_name}"

    # 既存のリンク/ディレクトリを処理
    if [ -L "$skill_dst" ]; then
      echo "REMOVE: 既存のシンボリックリンク $skill_dst"
      rm "$skill_dst"
    elif [ -e "$skill_dst" ]; then
      backup="${skill_dst}.bak.$(date +%Y%m%d%H%M%S)"
      echo "BACKUP: $skill_dst -> $backup"
      mv "$skill_dst" "$backup"
    fi

    echo "LINK: $skill_src -> $skill_dst"
    ln -s "${skill_src%/}" "$skill_dst"
  done
fi

echo ""
echo "セットアップ完了"

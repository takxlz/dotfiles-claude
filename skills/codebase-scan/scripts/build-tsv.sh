#!/bin/bash
# codebase-scan の .raw ファイルを統合して scan-result.tsv を生成する。
#
# 使い方:
#     build-tsv.sh <work_dir>
#
# 入力: <work_dir>/.tmp/*.raw
#   各行の形式: <repo>\t<keyword>\t<file>:<line>:<text>
#   <file> は repo ルートからの相対パス（先頭 `./` は許容）
#
# 出力: <work_dir>/scan-result.tsv
#   ヘッダ付き TSV: repo\tfile\tline\tkeyword\tmatch_text
#   同一 (repo, file, line) のキーワードは `,` 区切りで連結（出現順）

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <work_dir>" >&2
  exit 2
fi

work_dir="$1"
out="$work_dir/scan-result.tsv"

# .raw が無い場合はヘッダのみ書き出して終了
if ! compgen -G "$work_dir/.tmp/*.raw" > /dev/null; then
  printf 'repo\tfile\tline\tkeyword\tmatch_text\n' > "$out"
  echo "wrote 0 rows to $out"
  exit 0
fi

# 1段目: 各 .raw 行を正規化（path:line:text を分離、相対化、テキスト整形）
# 2段目: (repo, file, line, keyword) 昇順でソート
# 3段目: 連続する同 (repo, file, line) の keyword を `,` で連結
cat "$work_dir"/.tmp/*.raw \
  | awk '
    # 先頭 2 つのタブで repo / keyword を切り出し、残りに含まれるタブは text 側で保持して後段で置換する
    {
      t1 = index($0, "\t")
      if (t1 == 0) next
      repo = substr($0, 1, t1-1)
      after_t1 = substr($0, t1+1)
      t2 = index(after_t1, "\t")
      if (t2 == 0) next
      kw = substr(after_t1, 1, t2-1)
      rest = substr(after_t1, t2+1)
      c1 = index(rest, ":")
      if (c1 == 0) next
      rest2 = substr(rest, c1+1)
      c2 = index(rest2, ":")
      if (c2 == 0) next
      file = substr(rest, 1, c1-1)
      line_no = substr(rest2, 1, c2-1)
      text = substr(rest2, c2+1)
      if (line_no !~ /^[0-9]+$/) next
      sub(/^\.\//, "", file)
      gsub(/\t/, " ", text)
      gsub(/\r/, " ", text)
      sub(/^ +/, "", text)
      sub(/ +$/, "", text)
      if (length(text) > 500) text = substr(text, 1, 500) "…"
      print repo "\t" file "\t" line_no "\t" kw "\t" text
    }
  ' \
  | LC_ALL=C sort -t$'\t' -k1,1 -k2,2 -k3,3n -k4,4 \
  | awk -F'\t' '
    BEGIN { print "repo\tfile\tline\tkeyword\tmatch_text" }
    {
      key = $1 SUBSEP $2 SUBSEP $3
      if (key == prev_key) {
        kws = kws "," $4
      } else {
        if (NR > 1) print prev_repo "\t" prev_file "\t" prev_line "\t" kws "\t" prev_text
        kws = $4
        prev_repo = $1
        prev_file = $2
        prev_line = $3
        prev_text = $5
        prev_key = key
      }
    }
    END {
      if (NR > 0) print prev_repo "\t" prev_file "\t" prev_line "\t" kws "\t" prev_text
    }
  ' > "$out"

count=$(($(wc -l < "$out") - 1))
echo "wrote $count rows to $out"

---
name: note
description: A skill that outputs knowledge and insights gained during a conversation as a markdown file. Use when the user types "/note", or requests knowledge recording such as "summarize", "make a note", or "record learnings". Structures and records technical key points discussed in the conversation, questions the user had, and issues encountered along with their solutions.
---

# Knowledge Note Generation Skill

Save knowledge gained from conversations as markdown files in the `note/` directory under the working directory.

## Procedure

1. Review the conversation content and identify topics worth recording
2. Determine the category for each topic (technical research / troubleshooting / design decision / learning)
3. If a conversation has multiple topics that would be referenced independently, split them into separate files. If they are closely related, combine them into one file
4. Run `ls ./note/` to check existing files (create the directory with `mkdir -p ./note/` if it doesn't exist)
5. If an existing file matches the topic, ask the user: "Append to `[filename]` or create a new file?"
6. Based on the template, adjust the structure to fit the content, then create and save the markdown file
7. Tell the user the full path of the saved file. Suggest moving it to a subdirectory based on the topic's technical domain (e.g., `./note/Java/`)

## Output Destination

- Save location: `./note/` (directly under the working directory)
- Create `./note/` if it does not exist
- Do not automatically create subdirectories. Only suggest them and let the user decide

## File Naming

- Use a specific topic name that can be searched for later
- Format: `TopicName.md`
- Good examples: `PatternLayoutのスタックトレース描画.md`, `RustのライフタイムとNLL.md`
- Bad examples: `Javaのメモ.md` (too broad), `調査結果.md` (unclear what was investigated), `2026-03-29.md` (date alone doesn't indicate the content)

## Templates

Select the most appropriate template based on the conversation content. Templates are skeletons; feel free to add, omit, or reorder sections to fit the content.

### Technical Research

Summarize findings from investigating library specifications, language specifications, API behavior, etc.

```markdown
# [トピック名]

> [1〜2文の概要]

## 要点

- ポイント1
- ポイント2

## Q&A

- Q: 疑問の内容
  A: 調査で得られた答え

- Q: 別の疑問
  A: 答え

## 参考

- URL やドキュメントへのリンク
```

### Troubleshooting

Record problems encountered and the process of resolving them.

```markdown
# [トピック名]

> [1〜2文の概要]

## 症状

何が起きたか

## 原因

なぜ起きたか

## 解決策

どう解決したか（コード例があれば含める）

## 学び

この経験から得た教訓
```

### Design Decision

Record technology selections, architectural decisions, and their rationale.

```markdown
# [トピック名]

> [1〜2文の概要]

## 背景

何を解決したかったか

## 選択肢

- 案A: 概要、メリット、デメリット
- 案B: 概要、メリット、デメリット

## 判断

どれを選んだか、なぜか

## 補足

制約条件、今後の懸念など
```

### Learning / TIL

Quickly record short insights or things learned today.

```markdown
# [トピック名]

> [1〜2文の概要]

## 要点

- ポイント1
- ポイント2
- ポイント3
```

## Formatting

- Prioritize readability in raw markdown
  - Use `#` and `##` as primary headings. Only use `###` and beyond when content requires deeper nesting
  - Do not overuse bold labels (`**key**: value`). Omit them if bullet points convey the information sufficiently
  - Prioritize conciseness over decoration
- Output notes in Japanese
- Faithfully reflect the conversation content. Do not add information through speculation or supplementation
- Specify the language for code snippets (`java, `rust, etc.)
- Place content that the user repeatedly confirmed or emphasized at the top of key points, or make it bold

## Rules for Updating Existing Files

- When adding new items to an existing key points list, append them at the end
- When there is information that contradicts existing descriptions, replace the old description with the new content and add `(YYYY-MM-DD updated)` immediately after the changed section
- Maintain the existing section structure (headings and order). If a new section is needed, add it at the end

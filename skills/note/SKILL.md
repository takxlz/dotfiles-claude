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
7. Tell the user the full path of the saved file. Suggest moving it to a subdirectory based on the topic's technical domain (e.g., `./note/Rust/`)

## Output Destination

- Save location: `./note/` (directly under the working directory)
- Create `./note/` if it does not exist
- Do not automatically create subdirectories. Only suggest them and let the user decide

## File Naming

- Use a specific topic name that can be searched for later
- Format: `TopicName.md`
- Good examples: `PatternLayout-StackTrace-Rendering.md`, `Rust-Lifetimes-and-NLL.md`
- Bad examples: `Python-Notes.md` (too broad), `Investigation-Results.md` (unclear what was investigated), `2026-03-29.md` (date alone doesn't indicate the content)

## Templates

Select the most appropriate template based on the conversation content. Templates are skeletons; feel free to add, omit, or reorder sections to fit the content.

### Technical Research

Summarize findings from investigating library specifications, language specifications, API behavior, etc.

```markdown
# [Topic Name]

> [1-2 sentence summary]

## Key Points

- Point 1
- Point 2

## Q&A

- Q: The question
  A: The answer from investigation

- Q: Another question
  A: Answer

## References

- Links to URLs or documentation
```

### Troubleshooting

Record problems encountered and the process of resolving them.

```markdown
# [Topic Name]

> [1-2 sentence summary]

## Symptoms

What happened

## Root Cause

Why it happened

## Solution

How it was resolved (include code examples if applicable)

## Lessons Learned

Key takeaways from this experience
```

### Design Decision

Record technology selections, architectural decisions, and their rationale.

```markdown
# [Topic Name]

> [1-2 sentence summary]

## Context

What problem needed to be solved

## Options

- Option A: Summary, pros, cons
- Option B: Summary, pros, cons

## Decision

Which option was chosen and why

## Notes

Constraints, future concerns, etc.
```

### Learning / TIL

Quickly record short insights or things learned today.

```markdown
# [Topic Name]

> [1-2 sentence summary]

## Key Points

- Point 1
- Point 2
- Point 3
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

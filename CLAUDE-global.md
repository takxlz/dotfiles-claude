# Global Instructions

## Response Language

Always respond in Japanese. Write code comments in Japanese. Use English for variable names, function names, and commit messages.

## Confirmation Before Action

A question or request for clarification is never approval. When you propose an action, present options, or ask for confirmation, do not proceed until the user gives an explicit go-ahead. Examples of responses that are NOT approval:

- "What does that mean?" / "How would that work?"
- "Tell me about option A" / "What are the pros and cons?"
- "Which files would be affected?"

Wait for a clear directive such as "Do it", "Go ahead", "Yes", or "A please" before making changes.

## Agent Orchestration

### When to Use Subagents

Use subagents only for tasks that benefit from a separate context:

- Implementation planning → `planner`
- Architecture decisions → `architect`
- After writing or modifying code → `code-reviewer` (fresh context eliminates self-review bias)
- Build or type errors (iterative fix loop) → `build-error-resolver`
- Security-sensitive code (auth, input handling, API endpoints, secrets) → `security-reviewer`

### planner vs architect の選択基準

依頼の性質に応じて選択する：

| 問いの種類           | エージェント | 例                                   |
| -------------------- | ------------ | ------------------------------------ |
| 「〜すべきか？」     | architect    | 技術選定、移行判断、構成比較         |
| 「〜の影響は？」     | architect    | 設計変更の波及範囲、トレードオフ分析 |
| 「〜を実装して」     | planner      | 機能追加、バグ修正、リファクタリング |
| 「〜の手順を作って」 | planner      | 実装計画、フェーズ分割               |

両方の性質を含む場合（例: 新規機能で技術選定が必要）：
architect → planner の順で直列実行する

### Everything Else — Do It Yourself

The main agent handles these directly, using rules (auto-applied) and skills (on-demand):

- **Test-driven development** — Write tests before implementation. Use `tdd-workflow` skill for detailed patterns.
- **Documentation updates** — Update README.md, CLAUDE.md, API docs, comments, and CHANGELOG.md when code changes.
- **Refactoring** — Identify and remove dead code, consolidate duplicates.
- **Database work** — Use `postgres-patterns` and `database-migrations` skills.
- **Documentation lookup** — Use WebSearch / WebFetch directly.

### Security Escalation

When you find a CRITICAL security issue (hardcoded secrets, injection vulnerabilities, auth bypass):

1. Flag the issue immediately
2. Invoke `security-reviewer` for a comprehensive audit
3. `security-reviewer` findings take precedence on security matters

### Execution Policy

- Run independent subagents in parallel
- Run dependent subagents sequentially

## Documentation Updates on Code Changes

When code is changed, always update related documentation:

- README.md (usage, setup instructions, configuration examples)
- CLAUDE.md (project structure, commands, architecture descriptions)
- API documentation (endpoints, parameters, responses)
- Comments and doc comments (function signatures, behavior changes)
- CHANGELOG.md (if it exists)

Verify consistency between changes and documentation before completing work.

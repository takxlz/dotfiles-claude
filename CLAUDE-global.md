# Global Instructions

## Response Language

Always respond in Japanese. Write code comments in Japanese. Use English for variable names, function names, and commit messages.

## Agent Orchestration

### When to Use Subagents

Use subagents only for tasks that benefit from a separate context:

- Complex feature planning → `planner`
- System design or architectural decisions → `architect`
- After writing or modifying code → `code-reviewer` (fresh context eliminates self-review bias)
- Build or type errors (iterative fix loop) → `build-error-resolver`
- Security-sensitive code (auth, input handling, API endpoints, secrets) → `security-reviewer`

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

# Guardrails

## Commit Workflow

- Use Conventional Commits format (fix, feat, test, docs, refactor, chore, perf, ci, style, build, revert)
- Follow the existing pull-request and review flow

## Architecture

- Preserve the existing module organization
- Keep tests separate from source code

## Code Style

- Use `camelCase` for file naming
- Prefer relative imports

## Test-Driven Development

- Write tests before implementation (Red → Green → Refactor)
- Maintain 80%+ test coverage

## Code Review

- Only report issues with >80% confidence
- Prioritize: CRITICAL (security, data loss) → HIGH (bugs) → MEDIUM (quality) → LOW (style)
- Skip stylistic preferences unless they violate project conventions

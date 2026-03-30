---
description: "TypeScript/JavaScript coding style and testing rules"
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
---

# TypeScript / JavaScript

## Coding Style

- Use spread operator for immutable updates (never mutate directly)
- Use async/await with try-catch; provide clear, user-friendly error messages
- Use **Zod** for schema-based validation at system boundaries
- No `console.log` statements in production code; use proper logging libraries (see hooks for automatic detection)

## Testing

- **Jest** or **Vitest** as the unit test framework
- Test file naming: `*.test.ts` or `*.spec.ts`
- **Playwright** for E2E testing of critical user flows

## Reference

See skills: `typescript-patterns`, `tdd-workflow`

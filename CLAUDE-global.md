# Global Instructions

## Response Language

Always respond in Japanese. Write code comments in Japanese. Use English for variable names, function names, and commit messages.

## Agent Orchestration

Automatically use agents in the following situations:

- Complex feature requests or refactoring → `planner`
- After writing or modifying code → `code-reviewer`
- Security-sensitive code (auth, input handling, API endpoints) → `security-reviewer`
- Build or type errors → `build-error-resolver`
- Bug fixes or new feature implementation → `tdd-guide`
- Dead code cleanup → `refactor-cleaner`
- System design or architectural decisions → `architect`
- Documentation and codemap updates → `doc-updater`
- Library, framework, or API documentation lookup → `docs-lookup`
- SQL, schema design, DB performance → `database-reviewer`

### Language-Specific Review

Use language-specific review agents based on the target language:

- TypeScript / JavaScript → `typescript-reviewer`
- Rust → `rust-reviewer` (build errors → `rust-build-resolver`)
- Java / Spring Boot → `java-reviewer` (build errors → `java-build-resolver`)
- Python → `python-reviewer`

### Execution Policy

- Run independent tasks in parallel
- Run dependent tasks sequentially

## Documentation Updates on Code Changes

When code is changed, always update related documentation:

- README.md (usage, setup instructions, configuration examples)
- CLAUDE.md (project structure, commands, architecture descriptions)
- API documentation (endpoints, parameters, responses)
- Comments and JSDoc (function signatures, behavior changes)
- CHANGELOG.md (if it exists)

Verify consistency between changes and documentation before completing work.

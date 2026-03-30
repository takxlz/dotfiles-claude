---
name: coding-patterns
description: "Universal coding principles (KISS, DRY, YAGNI, readability) applicable across all languages. For language-specific patterns, see the dedicated pattern skills."
origin: ECC
---

# Universal Coding Standards

Language-agnostic coding principles applicable across all projects. For language-specific patterns and examples, see:

- **TypeScript/JavaScript/React**: skill `typescript-patterns`
- **Python**: skill `python-patterns`
- **Rust**: skill `rust-patterns`

## When to Activate

- Starting a new project or module
- Reviewing code for quality and maintainability
- Refactoring existing code to follow conventions
- Onboarding new contributors to coding conventions

## Code Quality Principles

### 1. Readability First

- Code is read more than written
- Clear variable and function names
- Self-documenting code preferred over comments
- Consistent formatting

### 2. KISS (Keep It Simple, Stupid)

- Simplest solution that works
- Avoid over-engineering
- No premature optimization
- Easy to understand > clever code

### 3. DRY (Don't Repeat Yourself)

- Extract common logic into functions
- Create reusable components
- Share utilities across modules
- Avoid copy-paste programming

### 4. YAGNI (You Aren't Gonna Need It)

- Don't build features before they're needed
- Avoid speculative generality
- Add complexity only when required
- Start simple, refactor when needed

## Naming Conventions

- **Variables**: descriptive, reveal intent (`isUserAuthenticated` not `flag`)
- **Functions**: verb-noun pattern (`fetchMarketData` not `market`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Booleans**: prefix with `is`, `has`, `should`, `can`

## Code Smell Detection

Watch for these anti-patterns in any language:

- **Long functions** (> 50 lines) → split into smaller, focused functions
- **Deep nesting** (> 3 levels) → use early returns / guard clauses
- **Magic numbers** → extract to named constants
- **Large parameter lists** → use objects / structs / DTOs
- **Commented-out code** → delete it; version control has the history
- **Duplicate logic** → extract into shared utility

## Comments

- Explain **why**, not **what**
- Good: `// Use exponential backoff to avoid overwhelming the API during outages`
- Bad: `// Increment counter by 1`
- Prefer self-documenting code over comments
- Use language-appropriate doc comments for public APIs (JSDoc, docstrings, Rustdoc, Javadoc)

## Error Handling

- Fail fast with clear error messages
- Handle errors at the appropriate level
- Never silently swallow exceptions
- Provide actionable context in error messages

## Immutability

- Prefer immutable data structures by default
- Make mutation explicit and intentional
- Use language-appropriate immutability patterns (spread, frozen dataclass, records, etc.)

**Remember**: Code quality is not negotiable. Clear, maintainable code enables rapid development and confident refactoring.

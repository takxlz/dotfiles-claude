---
description: "Rust coding style and testing rules"
globs: ["**/*.rs"]
---

# Rust

## Coding Style

- Prefer the `?` operator for error propagation
- Use **thiserror** for library error types
- Use **anyhow** for application-level errors
- Prefer borrowing over ownership transfer
- Avoid unnecessary `.clone()`; use `Cow` when flexible ownership is needed
- Only use `unsafe` when absolutely necessary; always add a `// SAFETY:` comment
- Use **cargo fmt** for code formatting
- Use **cargo clippy** for linting

## Testing

- **cargo test** as the testing framework
- Define unit tests inside `#[cfg(test)]` modules
- Place integration tests in the `tests/` directory (each file compiles as a separate binary)

## Reference

See skills: `rust-patterns`, `rust-testing`

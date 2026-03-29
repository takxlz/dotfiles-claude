---
description: "Rust coding style extending common rules"
globs: ["**/*.rs"]
---

# Rust Coding Style

> This file extends the common coding style rule with Rust specific content.

## Error Handling

- Prefer the `?` operator for error propagation
- Use **thiserror** for library error types
- Use **anyhow** for application-level errors

```rust
// Library: define explicit error types with thiserror
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("not found: {0}")]
    NotFound(String),
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

// Application: keep it concise with anyhow
fn run() -> anyhow::Result<()> {
    let data = std::fs::read_to_string("config.toml")?;
    Ok(())
}
```

## Ownership

- Prefer borrowing over ownership transfer
- Avoid unnecessary `.clone()`
- Use `Cow` when flexible ownership is needed

```rust
use std::borrow::Cow;

fn process(input: Cow<'_, str>) -> String {
    input.to_uppercase()
}
```

## Unsafe

- Only use `unsafe` when absolutely necessary
- Always document the safety rationale with a `// SAFETY:` comment

```rust
// SAFETY: the pointer is guaranteed by the caller to be non-null and properly aligned
unsafe { std::ptr::read(ptr) }
```

## Formatting

- Use **cargo fmt** for code formatting
- Use **cargo clippy** for linting

## Reference

See skill: `rust-patterns` for comprehensive Rust idioms and patterns.

---
description: "Rust testing extending common rules"
globs: ["**/*.rs"]
---

# Rust Testing

> This file extends the common testing rule with Rust specific content.

## Framework

Use **cargo test** as the testing framework.

## Unit Tests

Define unit test modules with `#[cfg(test)]`:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }
}
```

## Integration Tests

Place integration tests in the `tests/` directory:

```
src/
  lib.rs
tests/
  integration_test.rs
```

## Reference

See skill: `rust-testing` for detailed Rust testing patterns, fixtures, and mocking.

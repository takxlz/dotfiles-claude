---
description: "Python coding style and testing rules"
globs: ["**/*.py", "**/*.pyi"]
---

# Python

## Coding Style

- Follow **PEP 8** conventions
- Use **type annotations** on all function signatures
- Prefer `@dataclass(frozen=True)` or `NamedTuple` for immutable data classes
- **black** for code formatting
- **isort** for import sorting
- **ruff** for linting

## Testing

- **pytest** as the testing framework
- `pytest --cov=src --cov-report=term-missing` for coverage measurement
- Use `pytest.mark` for test categorization (`@pytest.mark.unit`, `@pytest.mark.integration`)

## Reference

See skills: `python-patterns`, `python-testing`

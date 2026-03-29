---
description: "Java coding style extending common rules"
globs: ["**/*.java"]
---

# Java Coding Style

> This file extends the common coding style rule with Java specific content.

## Standards

- Actively use **Java 17+** features (records, sealed classes, pattern matching)
- Follow the **Google Java Style Guide**

## Null Safety

- Use `Optional` for return values
- Never return `null` from public methods

```java
// WRONG: returning null
public User findUser(String id) {
    return null;
}

// CORRECT: use Optional
public Optional<User> findUser(String id) {
    return Optional.ofNullable(repository.find(id));
}
```

## Immutability

Prefer records and immutable collections:

```java
// Define immutable data classes with records
public record User(String name, String email) {}

// Use immutable collections
List<String> names = List.of("Alice", "Bob");
Map<String, Integer> scores = Map.of("Alice", 100);
```

## Spring Boot

Follow the Controller → Service → Repository layering:

```
Controller  → Request/response conversion only
Service     → Business logic
Repository  → Data access
```

## Reference

See skill: `java-patterns` for comprehensive Java/Spring Boot patterns.

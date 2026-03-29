---
description: "Java testing extending common rules"
globs: ["**/*.java"]
---

# Java Testing

> This file extends the common testing rule with Java specific content.

## Framework

Use **JUnit 5** as the testing framework.

## Unit Tests

Create mocks with **Mockito**:

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repository;

    @InjectMocks
    private UserService service;

    @Test
    void shouldFindUser() {
        when(repository.findById("1")).thenReturn(Optional.of(new User("Alice")));
        var user = service.findUser("1");
        assertThat(user).isPresent();
    }
}
```

## Integration Tests

Run integration tests with **@SpringBootTest**:

```java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnUser() throws Exception {
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk());
    }
}
```

## Reference

See skill: `java-patterns` for comprehensive Spring Boot testing patterns.

package org.example.todolist.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TodoListItemMapperTest {

    private TodoListItemMapper todoListItemMapper;

    @BeforeEach
    public void setUp() {
        todoListItemMapper = new TodoListItemMapperImpl();
    }
}

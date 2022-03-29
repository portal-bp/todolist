package org.example.todolist.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.example.todolist.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TodoListItemShareTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TodoListItemShare.class);
        TodoListItemShare todoListItemShare1 = new TodoListItemShare();
        todoListItemShare1.setId(1L);
        TodoListItemShare todoListItemShare2 = new TodoListItemShare();
        todoListItemShare2.setId(todoListItemShare1.getId());
        assertThat(todoListItemShare1).isEqualTo(todoListItemShare2);
        todoListItemShare2.setId(2L);
        assertThat(todoListItemShare1).isNotEqualTo(todoListItemShare2);
        todoListItemShare1.setId(null);
        assertThat(todoListItemShare1).isNotEqualTo(todoListItemShare2);
    }
}

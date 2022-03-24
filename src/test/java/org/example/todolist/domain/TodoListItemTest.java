package org.example.todolist.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.example.todolist.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TodoListItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TodoListItem.class);
        TodoListItem todoListItem1 = new TodoListItem();
        todoListItem1.setId(1L);
        TodoListItem todoListItem2 = new TodoListItem();
        todoListItem2.setId(todoListItem1.getId());
        assertThat(todoListItem1).isEqualTo(todoListItem2);
        todoListItem2.setId(2L);
        assertThat(todoListItem1).isNotEqualTo(todoListItem2);
        todoListItem1.setId(null);
        assertThat(todoListItem1).isNotEqualTo(todoListItem2);
    }
}

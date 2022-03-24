package org.example.todolist.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.example.todolist.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TodoListItemDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(TodoListItemDTO.class);
        TodoListItemDTO todoListItemDTO1 = new TodoListItemDTO();
        todoListItemDTO1.setId(1L);
        TodoListItemDTO todoListItemDTO2 = new TodoListItemDTO();
        assertThat(todoListItemDTO1).isNotEqualTo(todoListItemDTO2);
        todoListItemDTO2.setId(todoListItemDTO1.getId());
        assertThat(todoListItemDTO1).isEqualTo(todoListItemDTO2);
        todoListItemDTO2.setId(2L);
        assertThat(todoListItemDTO1).isNotEqualTo(todoListItemDTO2);
        todoListItemDTO1.setId(null);
        assertThat(todoListItemDTO1).isNotEqualTo(todoListItemDTO2);
    }
}

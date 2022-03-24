package org.example.todolist.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link org.example.todolist.domain.TodoListItem} entity.
 */
public class TodoListItemDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 256)
    private String description;

    private Boolean done;

    private TodoListDTO todoList;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getDone() {
        return done;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }

    public TodoListDTO getTodoList() {
        return todoList;
    }

    public void setTodoList(TodoListDTO todoList) {
        this.todoList = todoList;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TodoListItemDTO)) {
            return false;
        }

        TodoListItemDTO todoListItemDTO = (TodoListItemDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, todoListItemDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TodoListItemDTO{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", done='" + getDone() + "'" +
            ", todoList=" + getTodoList() +
            "}";
    }
}

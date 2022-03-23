package org.example.todolist.service.mapper;

import org.example.todolist.domain.TodoList;
import org.example.todolist.service.dto.TodoListDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link TodoList} and its DTO {@link TodoListDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface TodoListMapper extends EntityMapper<TodoListDTO, TodoList> {
    @Mapping(target = "user", source = "user", qualifiedByName = "login")
    TodoListDTO toDto(TodoList s);
}

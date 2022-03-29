package org.example.todolist.service.mapper;

import org.example.todolist.domain.TodoListItem;
import org.example.todolist.service.dto.TodoListItemDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link TodoListItem} and its DTO {@link TodoListItemDTO}.
 */
@Mapper(componentModel = "spring", uses = { TodoListMapper.class })
public interface TodoListItemMapper extends EntityMapper<TodoListItemDTO, TodoListItem> {
    @Mapping(target = "todoList", source = "todoList", qualifiedByName = "title")
    TodoListItemDTO toDto(TodoListItem s);

    @Named("description")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "description", source = "description")
    TodoListItemDTO toDtoDescription(TodoListItem todoListItem);
}

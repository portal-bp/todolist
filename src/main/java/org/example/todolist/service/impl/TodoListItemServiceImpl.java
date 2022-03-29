package org.example.todolist.service.impl;

import java.util.Optional;
import org.example.todolist.domain.TodoListItem;
import org.example.todolist.repository.TodoListItemRepository;
import org.example.todolist.service.TodoListItemService;
import org.example.todolist.service.dto.TodoListItemDTO;
import org.example.todolist.service.mapper.TodoListItemMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link TodoListItem}.
 */
@Service
@Transactional
public class TodoListItemServiceImpl implements TodoListItemService {

    private final Logger log = LoggerFactory.getLogger(TodoListItemServiceImpl.class);

    private final TodoListItemRepository todoListItemRepository;

    private final TodoListItemMapper todoListItemMapper;

    public TodoListItemServiceImpl(TodoListItemRepository todoListItemRepository, TodoListItemMapper todoListItemMapper) {
        this.todoListItemRepository = todoListItemRepository;
        this.todoListItemMapper = todoListItemMapper;
    }

    @Override
    public TodoListItemDTO save(TodoListItemDTO todoListItemDTO) {
        log.debug("Request to save TodoListItem : {}", todoListItemDTO);
        TodoListItem todoListItem = todoListItemMapper.toEntity(todoListItemDTO);
        todoListItem = todoListItemRepository.save(todoListItem);
        return todoListItemMapper.toDto(todoListItem);
    }

    @Override
    public Optional<TodoListItemDTO> partialUpdate(TodoListItemDTO todoListItemDTO) {
        log.debug("Request to partially update TodoListItem : {}", todoListItemDTO);

        return todoListItemRepository
            .findById(todoListItemDTO.getId())
            .map(existingTodoListItem -> {
                todoListItemMapper.partialUpdate(existingTodoListItem, todoListItemDTO);

                return existingTodoListItem;
            })
            .map(todoListItemRepository::save)
            .map(todoListItemMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TodoListItemDTO> findAll(Pageable pageable) {
        log.debug("Request to get all TodoListItems");
        return todoListItemRepository.findAll(pageable).map(todoListItemMapper::toDto);
    }

    public Page<TodoListItemDTO> findAllWithEagerRelationships(Pageable pageable) {
        return todoListItemRepository.findAllWithEagerRelationships(pageable).map(todoListItemMapper::toDto);
    }

    @Override
    public Page<TodoListItemDTO> findByUserIsCurrentUser(Pageable pageable) {
        return todoListItemRepository.findByUserIsCurrentUser(pageable).map(todoListItemMapper::toDto);
    }

    @Override
    public Page<TodoListItemDTO> findByUserIsCurrentUserAndTodoListId(Pageable pageable, Long todoListId) {
        log.debug("Request to retrieve TodoListItem by TodoListItemId : {}", todoListId);
        return todoListItemRepository.findByUserIsCurrentUserAndTodoListId(pageable, todoListId).map(todoListItemMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TodoListItemDTO> findOne(Long id) {
        log.debug("Request to get TodoListItem : {}", id);
        return todoListItemRepository.findOneWithEagerRelationships(id).map(todoListItemMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete TodoListItem : {}", id);
        todoListItemRepository.deleteById(id);
    }
}

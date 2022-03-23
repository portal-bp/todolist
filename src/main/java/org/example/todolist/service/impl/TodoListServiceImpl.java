package org.example.todolist.service.impl;

import java.util.Optional;
import org.example.todolist.domain.TodoList;
import org.example.todolist.repository.TodoListRepository;
import org.example.todolist.service.TodoListService;
import org.example.todolist.service.dto.TodoListDTO;
import org.example.todolist.service.mapper.TodoListMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link TodoList}.
 */
@Service
@Transactional
public class TodoListServiceImpl implements TodoListService {

    private final Logger log = LoggerFactory.getLogger(TodoListServiceImpl.class);

    private final TodoListRepository todoListRepository;

    private final TodoListMapper todoListMapper;

    public TodoListServiceImpl(TodoListRepository todoListRepository, TodoListMapper todoListMapper) {
        this.todoListRepository = todoListRepository;
        this.todoListMapper = todoListMapper;
    }

    @Override
    public TodoListDTO save(TodoListDTO todoListDTO) {
        log.debug("Request to save TodoList : {}", todoListDTO);
        TodoList todoList = todoListMapper.toEntity(todoListDTO);
        todoList = todoListRepository.save(todoList);
        return todoListMapper.toDto(todoList);
    }

    @Override
    public Optional<TodoListDTO> partialUpdate(TodoListDTO todoListDTO) {
        log.debug("Request to partially update TodoList : {}", todoListDTO);

        return todoListRepository
            .findById(todoListDTO.getId())
            .map(existingTodoList -> {
                todoListMapper.partialUpdate(existingTodoList, todoListDTO);

                return existingTodoList;
            })
            .map(todoListRepository::save)
            .map(todoListMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TodoListDTO> findAll(Pageable pageable) {
        log.debug("Request to get all TodoLists");
        return todoListRepository.findAll(pageable).map(todoListMapper::toDto);
    }

    public Page<TodoListDTO> findAllWithEagerRelationships(Pageable pageable) {
        return todoListRepository.findAllWithEagerRelationships(pageable).map(todoListMapper::toDto);
    }

    @Override
    public Page<TodoListDTO> findByUserIsCurrentUser(Pageable pageable) {
        return todoListRepository.findByUserIsCurrentUser(pageable).map(todoListMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TodoListDTO> findOne(Long id) {
        log.debug("Request to get TodoList : {}", id);
        return todoListRepository.findOneWithEagerRelationships(id).map(todoListMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete TodoList : {}", id);
        todoListRepository.deleteById(id);
    }
}

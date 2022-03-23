package org.example.todolist.service;

import java.util.Optional;
import org.example.todolist.service.dto.TodoListDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link org.example.todolist.domain.TodoList}.
 */
public interface TodoListService {
    /**
     * Save a todoList.
     *
     * @param todoListDTO the entity to save.
     * @return the persisted entity.
     */
    TodoListDTO save(TodoListDTO todoListDTO);

    /**
     * Partially updates a todoList.
     *
     * @param todoListDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<TodoListDTO> partialUpdate(TodoListDTO todoListDTO);

    /**
     * Get all the todoLists.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<TodoListDTO> findAll(Pageable pageable);

    /**
     * Get all the todoLists with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<TodoListDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get all the todoLists with eager load of many-to-one relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<TodoListDTO> findByUserIsCurrentUser(Pageable pageable);

    /**
     * Get the "id" todoList.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<TodoListDTO> findOne(Long id);

    /**
     * Delete the "id" todoList.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}

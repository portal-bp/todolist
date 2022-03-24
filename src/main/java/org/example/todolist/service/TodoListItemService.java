package org.example.todolist.service;

import java.util.Optional;
import org.example.todolist.service.dto.TodoListDTO;
import org.example.todolist.service.dto.TodoListItemDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link org.example.todolist.domain.TodoListItem}.
 */
public interface TodoListItemService {
    /**
     * Save a todoListItem.
     *
     * @param todoListItemDTO the entity to save.
     * @return the persisted entity.
     */
    TodoListItemDTO save(TodoListItemDTO todoListItemDTO);

    /**
     * Partially updates a todoListItem.
     *
     * @param todoListItemDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<TodoListItemDTO> partialUpdate(TodoListItemDTO todoListItemDTO);

    /**
     * Get all the todoListItems.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<TodoListItemDTO> findAll(Pageable pageable);

    /**
     * Get all the todoListItems with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<TodoListItemDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get all the todoLists with eager load of many-to-one relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<TodoListItemDTO> findByUserIsCurrentUser(Pageable pageable);

    /**
     * Get the "id" todoListItem.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<TodoListItemDTO> findOne(Long id);

    /**
     * Delete the "id" todoListItem.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}

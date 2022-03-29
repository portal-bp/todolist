package org.example.todolist.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.example.todolist.domain.TodoListItemShare;
import org.example.todolist.repository.TodoListItemShareRepository;
import org.example.todolist.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.example.todolist.domain.TodoListItemShare}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TodoListItemShareResource {

    private final Logger log = LoggerFactory.getLogger(TodoListItemShareResource.class);

    private static final String ENTITY_NAME = "todoListItemShare";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TodoListItemShareRepository todoListItemShareRepository;

    public TodoListItemShareResource(TodoListItemShareRepository todoListItemShareRepository) {
        this.todoListItemShareRepository = todoListItemShareRepository;
    }

    /**
     * {@code POST  /todo-list-item-shares} : Create a new todoListItemShare.
     *
     * @param todoListItemShare the todoListItemShare to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new todoListItemShare, or with status {@code 400 (Bad Request)} if the todoListItemShare has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/todo-list-item-shares")
    public ResponseEntity<TodoListItemShare> createTodoListItemShare(@RequestBody TodoListItemShare todoListItemShare)
        throws URISyntaxException {
        log.debug("REST request to save TodoListItemShare : {}", todoListItemShare);
        if (todoListItemShare.getId() != null) {
            throw new BadRequestAlertException("A new todoListItemShare cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TodoListItemShare result = todoListItemShareRepository.save(todoListItemShare);
        return ResponseEntity
            .created(new URI("/api/todo-list-item-shares/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /todo-list-item-shares/:id} : Updates an existing todoListItemShare.
     *
     * @param id the id of the todoListItemShare to save.
     * @param todoListItemShare the todoListItemShare to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todoListItemShare,
     * or with status {@code 400 (Bad Request)} if the todoListItemShare is not valid,
     * or with status {@code 500 (Internal Server Error)} if the todoListItemShare couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/todo-list-item-shares/{id}")
    public ResponseEntity<TodoListItemShare> updateTodoListItemShare(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TodoListItemShare todoListItemShare
    ) throws URISyntaxException {
        log.debug("REST request to update TodoListItemShare : {}, {}", id, todoListItemShare);
        if (todoListItemShare.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todoListItemShare.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todoListItemShareRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TodoListItemShare result = todoListItemShareRepository.save(todoListItemShare);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todoListItemShare.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /todo-list-item-shares/:id} : Partial updates given fields of an existing todoListItemShare, field will ignore if it is null
     *
     * @param id the id of the todoListItemShare to save.
     * @param todoListItemShare the todoListItemShare to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todoListItemShare,
     * or with status {@code 400 (Bad Request)} if the todoListItemShare is not valid,
     * or with status {@code 404 (Not Found)} if the todoListItemShare is not found,
     * or with status {@code 500 (Internal Server Error)} if the todoListItemShare couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/todo-list-item-shares/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TodoListItemShare> partialUpdateTodoListItemShare(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TodoListItemShare todoListItemShare
    ) throws URISyntaxException {
        log.debug("REST request to partial update TodoListItemShare partially : {}, {}", id, todoListItemShare);
        if (todoListItemShare.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todoListItemShare.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todoListItemShareRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TodoListItemShare> result = todoListItemShareRepository
            .findById(todoListItemShare.getId())
            .map(existingTodoListItemShare -> {
                return existingTodoListItemShare;
            })
            .map(todoListItemShareRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todoListItemShare.getId().toString())
        );
    }

    /**
     * {@code GET  /todo-list-item-shares} : get all the todoListItemShares.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of todoListItemShares in body.
     */
    @GetMapping("/todo-list-item-shares")
    public List<TodoListItemShare> getAllTodoListItemShares(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all TodoListItemShares");
        return todoListItemShareRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /todo-list-item-shares/:id} : get the "id" todoListItemShare.
     *
     * @param id the id of the todoListItemShare to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the todoListItemShare, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/todo-list-item-shares/{id}")
    public ResponseEntity<TodoListItemShare> getTodoListItemShare(@PathVariable Long id) {
        log.debug("REST request to get TodoListItemShare : {}", id);
        Optional<TodoListItemShare> todoListItemShare = todoListItemShareRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(todoListItemShare);
    }

    /**
     * {@code DELETE  /todo-list-item-shares/:id} : delete the "id" todoListItemShare.
     *
     * @param id the id of the todoListItemShare to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/todo-list-item-shares/{id}")
    public ResponseEntity<Void> deleteTodoListItemShare(@PathVariable Long id) {
        log.debug("REST request to delete TodoListItemShare : {}", id);
        todoListItemShareRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

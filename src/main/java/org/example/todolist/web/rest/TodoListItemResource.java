package org.example.todolist.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.example.todolist.repository.TodoListItemRepository;
import org.example.todolist.service.TodoListItemService;
import org.example.todolist.service.dto.TodoListItemDTO;
import org.example.todolist.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.example.todolist.domain.TodoListItem}.
 */
@RestController
@RequestMapping("/api")
public class TodoListItemResource {

    private final Logger log = LoggerFactory.getLogger(TodoListItemResource.class);

    private static final String ENTITY_NAME = "todoListItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TodoListItemService todoListItemService;

    private final TodoListItemRepository todoListItemRepository;

    public TodoListItemResource(TodoListItemService todoListItemService, TodoListItemRepository todoListItemRepository) {
        this.todoListItemService = todoListItemService;
        this.todoListItemRepository = todoListItemRepository;
    }

    /**
     * {@code POST  /todo-list-items} : Create a new todoListItem.
     *
     * @param todoListItemDTO the todoListItemDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new todoListItemDTO, or with status {@code 400 (Bad Request)} if the todoListItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/todo-list-items")
    public ResponseEntity<TodoListItemDTO> createTodoListItem(@Valid @RequestBody TodoListItemDTO todoListItemDTO)
        throws URISyntaxException {
        log.debug("REST request to save TodoListItem : {}", todoListItemDTO);
        if (todoListItemDTO.getId() != null) {
            throw new BadRequestAlertException("A new todoListItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TodoListItemDTO result = todoListItemService.save(todoListItemDTO);
        return ResponseEntity
            .created(new URI("/api/todo-list-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /todo-list-items/:id} : Updates an existing todoListItem.
     *
     * @param id the id of the todoListItemDTO to save.
     * @param todoListItemDTO the todoListItemDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todoListItemDTO,
     * or with status {@code 400 (Bad Request)} if the todoListItemDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the todoListItemDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/todo-list-items/{id}")
    public ResponseEntity<TodoListItemDTO> updateTodoListItem(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TodoListItemDTO todoListItemDTO
    ) throws URISyntaxException {
        log.debug("REST request to update TodoListItem : {}, {}", id, todoListItemDTO);
        if (todoListItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todoListItemDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todoListItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TodoListItemDTO result = todoListItemService.save(todoListItemDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todoListItemDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /todo-list-items/:id} : Partial updates given fields of an existing todoListItem, field will ignore if it is null
     *
     * @param id the id of the todoListItemDTO to save.
     * @param todoListItemDTO the todoListItemDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todoListItemDTO,
     * or with status {@code 400 (Bad Request)} if the todoListItemDTO is not valid,
     * or with status {@code 404 (Not Found)} if the todoListItemDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the todoListItemDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/todo-list-items/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TodoListItemDTO> partialUpdateTodoListItem(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TodoListItemDTO todoListItemDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update TodoListItem partially : {}, {}", id, todoListItemDTO);
        if (todoListItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todoListItemDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todoListItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TodoListItemDTO> result = todoListItemService.partialUpdate(todoListItemDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todoListItemDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /todo-list-items} : get all the todoListItems.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of todoListItems in body.
     */
    @GetMapping("/todo-list-items")
    public ResponseEntity<List<TodoListItemDTO>> getAllTodoListItems(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of TodoListItems");
        Page<TodoListItemDTO> page;
        if (eagerload) {
            page = todoListItemService.findByUserIsCurrentUser(pageable);
        } else {
            page = todoListItemService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /todo-list-items/:id} : get the "id" todoListItem.
     *
     * @param id the id of the todoListItemDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the todoListItemDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/todo-list-items/{id}")
    public ResponseEntity<TodoListItemDTO> getTodoListItem(@PathVariable Long id) {
        log.debug("REST request to get TodoListItem : {}", id);
        Optional<TodoListItemDTO> todoListItemDTO = todoListItemService.findOne(id);
        return ResponseUtil.wrapOrNotFound(todoListItemDTO);
    }

    /**
     * {@code DELETE  /todo-list-items/:id} : delete the "id" todoListItem.
     *
     * @param id the id of the todoListItemDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/todo-list-items/{id}")
    public ResponseEntity<Void> deleteTodoListItem(@PathVariable Long id) {
        log.debug("REST request to delete TodoListItem : {}", id);
        todoListItemService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

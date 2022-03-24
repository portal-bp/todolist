package org.example.todolist.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.example.todolist.IntegrationTest;
import org.example.todolist.domain.TodoList;
import org.example.todolist.domain.TodoListItem;
import org.example.todolist.repository.TodoListItemRepository;
import org.example.todolist.service.dto.TodoListItemDTO;
import org.example.todolist.service.mapper.TodoListItemMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TodoListItemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TodoListItemResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_DONE = false;
    private static final Boolean UPDATED_DONE = true;

    private static final String ENTITY_API_URL = "/api/todo-list-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TodoListItemRepository todoListItemRepository;

    @Autowired
    private TodoListItemMapper todoListItemMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTodoListItemMockMvc;

    private TodoListItem todoListItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TodoListItem createEntity(EntityManager em) {
        TodoListItem todoListItem = new TodoListItem().description(DEFAULT_DESCRIPTION).done(DEFAULT_DONE);
        // Add required entity
        TodoList todoList;
        if (TestUtil.findAll(em, TodoList.class).isEmpty()) {
            todoList = TodoListResourceIT.createEntity(em);
            em.persist(todoList);
            em.flush();
        } else {
            todoList = TestUtil.findAll(em, TodoList.class).get(0);
        }
        todoListItem.setTodoList(todoList);
        return todoListItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TodoListItem createUpdatedEntity(EntityManager em) {
        TodoListItem todoListItem = new TodoListItem().description(UPDATED_DESCRIPTION).done(UPDATED_DONE);
        // Add required entity
        TodoList todoList;
        if (TestUtil.findAll(em, TodoList.class).isEmpty()) {
            todoList = TodoListResourceIT.createUpdatedEntity(em);
            em.persist(todoList);
            em.flush();
        } else {
            todoList = TestUtil.findAll(em, TodoList.class).get(0);
        }
        todoListItem.setTodoList(todoList);
        return todoListItem;
    }

    @BeforeEach
    public void initTest() {
        todoListItem = createEntity(em);
    }

    @Test
    @Transactional
    void createTodoListItem() throws Exception {
        int databaseSizeBeforeCreate = todoListItemRepository.findAll().size();
        // Create the TodoListItem
        TodoListItemDTO todoListItemDTO = todoListItemMapper.toDto(todoListItem);
        restTodoListItemMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todoListItemDTO))
            )
            .andExpect(status().isCreated());

        // Validate the TodoListItem in the database
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeCreate + 1);
        TodoListItem testTodoListItem = todoListItemList.get(todoListItemList.size() - 1);
        assertThat(testTodoListItem.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTodoListItem.getDone()).isEqualTo(DEFAULT_DONE);
    }

    @Test
    @Transactional
    void createTodoListItemWithExistingId() throws Exception {
        // Create the TodoListItem with an existing ID
        todoListItem.setId(1L);
        TodoListItemDTO todoListItemDTO = todoListItemMapper.toDto(todoListItem);

        int databaseSizeBeforeCreate = todoListItemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTodoListItemMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todoListItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoListItem in the database
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = todoListItemRepository.findAll().size();
        // set the field null
        todoListItem.setDescription(null);

        // Create the TodoListItem, which fails.
        TodoListItemDTO todoListItemDTO = todoListItemMapper.toDto(todoListItem);

        restTodoListItemMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todoListItemDTO))
            )
            .andExpect(status().isBadRequest());

        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTodoListItems() throws Exception {
        // Initialize the database
        todoListItemRepository.saveAndFlush(todoListItem);

        // Get all the todoListItemList
        restTodoListItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(todoListItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].done").value(hasItem(DEFAULT_DONE.booleanValue())));
    }

    @Test
    @Transactional
    void getTodoListItem() throws Exception {
        // Initialize the database
        todoListItemRepository.saveAndFlush(todoListItem);

        // Get the todoListItem
        restTodoListItemMockMvc
            .perform(get(ENTITY_API_URL_ID, todoListItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(todoListItem.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.done").value(DEFAULT_DONE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingTodoListItem() throws Exception {
        // Get the todoListItem
        restTodoListItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTodoListItem() throws Exception {
        // Initialize the database
        todoListItemRepository.saveAndFlush(todoListItem);

        int databaseSizeBeforeUpdate = todoListItemRepository.findAll().size();

        // Update the todoListItem
        TodoListItem updatedTodoListItem = todoListItemRepository.findById(todoListItem.getId()).get();
        // Disconnect from session so that the updates on updatedTodoListItem are not directly saved in db
        em.detach(updatedTodoListItem);
        updatedTodoListItem.description(UPDATED_DESCRIPTION).done(UPDATED_DONE);
        TodoListItemDTO todoListItemDTO = todoListItemMapper.toDto(updatedTodoListItem);

        restTodoListItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, todoListItemDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoListItemDTO))
            )
            .andExpect(status().isOk());

        // Validate the TodoListItem in the database
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeUpdate);
        TodoListItem testTodoListItem = todoListItemList.get(todoListItemList.size() - 1);
        assertThat(testTodoListItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTodoListItem.getDone()).isEqualTo(UPDATED_DONE);
    }

    @Test
    @Transactional
    void putNonExistingTodoListItem() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemRepository.findAll().size();
        todoListItem.setId(count.incrementAndGet());

        // Create the TodoListItem
        TodoListItemDTO todoListItemDTO = todoListItemMapper.toDto(todoListItem);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoListItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, todoListItemDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoListItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoListItem in the database
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTodoListItem() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemRepository.findAll().size();
        todoListItem.setId(count.incrementAndGet());

        // Create the TodoListItem
        TodoListItemDTO todoListItemDTO = todoListItemMapper.toDto(todoListItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoListItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoListItem in the database
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTodoListItem() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemRepository.findAll().size();
        todoListItem.setId(count.incrementAndGet());

        // Create the TodoListItem
        TodoListItemDTO todoListItemDTO = todoListItemMapper.toDto(todoListItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListItemMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todoListItemDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TodoListItem in the database
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTodoListItemWithPatch() throws Exception {
        // Initialize the database
        todoListItemRepository.saveAndFlush(todoListItem);

        int databaseSizeBeforeUpdate = todoListItemRepository.findAll().size();

        // Update the todoListItem using partial update
        TodoListItem partialUpdatedTodoListItem = new TodoListItem();
        partialUpdatedTodoListItem.setId(todoListItem.getId());

        partialUpdatedTodoListItem.description(UPDATED_DESCRIPTION).done(UPDATED_DONE);

        restTodoListItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodoListItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodoListItem))
            )
            .andExpect(status().isOk());

        // Validate the TodoListItem in the database
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeUpdate);
        TodoListItem testTodoListItem = todoListItemList.get(todoListItemList.size() - 1);
        assertThat(testTodoListItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTodoListItem.getDone()).isEqualTo(UPDATED_DONE);
    }

    @Test
    @Transactional
    void fullUpdateTodoListItemWithPatch() throws Exception {
        // Initialize the database
        todoListItemRepository.saveAndFlush(todoListItem);

        int databaseSizeBeforeUpdate = todoListItemRepository.findAll().size();

        // Update the todoListItem using partial update
        TodoListItem partialUpdatedTodoListItem = new TodoListItem();
        partialUpdatedTodoListItem.setId(todoListItem.getId());

        partialUpdatedTodoListItem.description(UPDATED_DESCRIPTION).done(UPDATED_DONE);

        restTodoListItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodoListItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodoListItem))
            )
            .andExpect(status().isOk());

        // Validate the TodoListItem in the database
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeUpdate);
        TodoListItem testTodoListItem = todoListItemList.get(todoListItemList.size() - 1);
        assertThat(testTodoListItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTodoListItem.getDone()).isEqualTo(UPDATED_DONE);
    }

    @Test
    @Transactional
    void patchNonExistingTodoListItem() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemRepository.findAll().size();
        todoListItem.setId(count.incrementAndGet());

        // Create the TodoListItem
        TodoListItemDTO todoListItemDTO = todoListItemMapper.toDto(todoListItem);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoListItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, todoListItemDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoListItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoListItem in the database
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTodoListItem() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemRepository.findAll().size();
        todoListItem.setId(count.incrementAndGet());

        // Create the TodoListItem
        TodoListItemDTO todoListItemDTO = todoListItemMapper.toDto(todoListItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoListItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoListItem in the database
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTodoListItem() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemRepository.findAll().size();
        todoListItem.setId(count.incrementAndGet());

        // Create the TodoListItem
        TodoListItemDTO todoListItemDTO = todoListItemMapper.toDto(todoListItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListItemMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoListItemDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TodoListItem in the database
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTodoListItem() throws Exception {
        // Initialize the database
        todoListItemRepository.saveAndFlush(todoListItem);

        int databaseSizeBeforeDelete = todoListItemRepository.findAll().size();

        // Delete the todoListItem
        restTodoListItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, todoListItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TodoListItem> todoListItemList = todoListItemRepository.findAll();
        assertThat(todoListItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

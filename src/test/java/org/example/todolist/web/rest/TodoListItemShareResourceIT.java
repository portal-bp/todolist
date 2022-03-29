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
import org.example.todolist.domain.TodoListItemShare;
import org.example.todolist.repository.TodoListItemShareRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TodoListItemShareResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TodoListItemShareResourceIT {

    private static final String ENTITY_API_URL = "/api/todo-list-item-shares";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TodoListItemShareRepository todoListItemShareRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTodoListItemShareMockMvc;

    private TodoListItemShare todoListItemShare;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TodoListItemShare createEntity(EntityManager em) {
        TodoListItemShare todoListItemShare = new TodoListItemShare();
        return todoListItemShare;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TodoListItemShare createUpdatedEntity(EntityManager em) {
        TodoListItemShare todoListItemShare = new TodoListItemShare();
        return todoListItemShare;
    }

    @BeforeEach
    public void initTest() {
        todoListItemShare = createEntity(em);
    }

    @Test
    @Transactional
    void createTodoListItemShare() throws Exception {
        int databaseSizeBeforeCreate = todoListItemShareRepository.findAll().size();
        // Create the TodoListItemShare
        restTodoListItemShareMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todoListItemShare))
            )
            .andExpect(status().isCreated());

        // Validate the TodoListItemShare in the database
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeCreate + 1);
        TodoListItemShare testTodoListItemShare = todoListItemShareList.get(todoListItemShareList.size() - 1);
    }

    @Test
    @Transactional
    void createTodoListItemShareWithExistingId() throws Exception {
        // Create the TodoListItemShare with an existing ID
        todoListItemShare.setId(1L);

        int databaseSizeBeforeCreate = todoListItemShareRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTodoListItemShareMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todoListItemShare))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoListItemShare in the database
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTodoListItemShares() throws Exception {
        // Initialize the database
        todoListItemShareRepository.saveAndFlush(todoListItemShare);

        // Get all the todoListItemShareList
        restTodoListItemShareMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(todoListItemShare.getId().intValue())));
    }

    @Test
    @Transactional
    void getTodoListItemShare() throws Exception {
        // Initialize the database
        todoListItemShareRepository.saveAndFlush(todoListItemShare);

        // Get the todoListItemShare
        restTodoListItemShareMockMvc
            .perform(get(ENTITY_API_URL_ID, todoListItemShare.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(todoListItemShare.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingTodoListItemShare() throws Exception {
        // Get the todoListItemShare
        restTodoListItemShareMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTodoListItemShare() throws Exception {
        // Initialize the database
        todoListItemShareRepository.saveAndFlush(todoListItemShare);

        int databaseSizeBeforeUpdate = todoListItemShareRepository.findAll().size();

        // Update the todoListItemShare
        TodoListItemShare updatedTodoListItemShare = todoListItemShareRepository.findById(todoListItemShare.getId()).get();
        // Disconnect from session so that the updates on updatedTodoListItemShare are not directly saved in db
        em.detach(updatedTodoListItemShare);

        restTodoListItemShareMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTodoListItemShare.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTodoListItemShare))
            )
            .andExpect(status().isOk());

        // Validate the TodoListItemShare in the database
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeUpdate);
        TodoListItemShare testTodoListItemShare = todoListItemShareList.get(todoListItemShareList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingTodoListItemShare() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemShareRepository.findAll().size();
        todoListItemShare.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoListItemShareMockMvc
            .perform(
                put(ENTITY_API_URL_ID, todoListItemShare.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoListItemShare))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoListItemShare in the database
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTodoListItemShare() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemShareRepository.findAll().size();
        todoListItemShare.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListItemShareMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoListItemShare))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoListItemShare in the database
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTodoListItemShare() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemShareRepository.findAll().size();
        todoListItemShare.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListItemShareMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todoListItemShare))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TodoListItemShare in the database
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTodoListItemShareWithPatch() throws Exception {
        // Initialize the database
        todoListItemShareRepository.saveAndFlush(todoListItemShare);

        int databaseSizeBeforeUpdate = todoListItemShareRepository.findAll().size();

        // Update the todoListItemShare using partial update
        TodoListItemShare partialUpdatedTodoListItemShare = new TodoListItemShare();
        partialUpdatedTodoListItemShare.setId(todoListItemShare.getId());

        restTodoListItemShareMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodoListItemShare.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodoListItemShare))
            )
            .andExpect(status().isOk());

        // Validate the TodoListItemShare in the database
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeUpdate);
        TodoListItemShare testTodoListItemShare = todoListItemShareList.get(todoListItemShareList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateTodoListItemShareWithPatch() throws Exception {
        // Initialize the database
        todoListItemShareRepository.saveAndFlush(todoListItemShare);

        int databaseSizeBeforeUpdate = todoListItemShareRepository.findAll().size();

        // Update the todoListItemShare using partial update
        TodoListItemShare partialUpdatedTodoListItemShare = new TodoListItemShare();
        partialUpdatedTodoListItemShare.setId(todoListItemShare.getId());

        restTodoListItemShareMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodoListItemShare.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodoListItemShare))
            )
            .andExpect(status().isOk());

        // Validate the TodoListItemShare in the database
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeUpdate);
        TodoListItemShare testTodoListItemShare = todoListItemShareList.get(todoListItemShareList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingTodoListItemShare() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemShareRepository.findAll().size();
        todoListItemShare.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoListItemShareMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, todoListItemShare.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoListItemShare))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoListItemShare in the database
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTodoListItemShare() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemShareRepository.findAll().size();
        todoListItemShare.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListItemShareMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoListItemShare))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoListItemShare in the database
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTodoListItemShare() throws Exception {
        int databaseSizeBeforeUpdate = todoListItemShareRepository.findAll().size();
        todoListItemShare.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoListItemShareMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoListItemShare))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TodoListItemShare in the database
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTodoListItemShare() throws Exception {
        // Initialize the database
        todoListItemShareRepository.saveAndFlush(todoListItemShare);

        int databaseSizeBeforeDelete = todoListItemShareRepository.findAll().size();

        // Delete the todoListItemShare
        restTodoListItemShareMockMvc
            .perform(delete(ENTITY_API_URL_ID, todoListItemShare.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TodoListItemShare> todoListItemShareList = todoListItemShareRepository.findAll();
        assertThat(todoListItemShareList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

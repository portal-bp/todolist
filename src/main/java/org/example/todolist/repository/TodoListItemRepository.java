package org.example.todolist.repository;

import java.util.List;
import java.util.Optional;
import org.example.todolist.domain.TodoList;
import org.example.todolist.domain.TodoListItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TodoListItem entity.
 */
@Repository
public interface TodoListItemRepository extends JpaRepository<TodoListItem, Long> {
    default Optional<TodoListItem> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TodoListItem> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TodoListItem> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select todoListItem from TodoListItem todoListItem LEFT JOIN TodoList todoList " +
        "ON todoListItem.todoList.id = todoList.id " +
        "where todoList.user.login = ?#{principal.username}",
        countQuery = "select count(distinct todoListItem) from TodoListItem todoListItem LEFT JOIN TodoList todoList " +
        "ON todoListItem.todoList.id = todoList.id " +
        "where todoList.user.login = ?#{principal.username}"
    )
    Page<TodoListItem> findByUserIsCurrentUser(Pageable pageable);

    @Query(
        value = "select distinct todoListItem from TodoListItem todoListItem left join fetch todoListItem.todoList",
        countQuery = "select count(distinct todoListItem) from TodoListItem todoListItem"
    )
    Page<TodoListItem> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct todoListItem from TodoListItem todoListItem left join fetch todoListItem.todoList")
    List<TodoListItem> findAllWithToOneRelationships();

    @Query("select todoListItem from TodoListItem todoListItem left join fetch todoListItem.todoList where todoListItem.id =:id")
    Optional<TodoListItem> findOneWithToOneRelationships(@Param("id") Long id);
}

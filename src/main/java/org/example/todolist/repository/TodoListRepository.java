package org.example.todolist.repository;

import java.util.List;
import java.util.Optional;
import org.example.todolist.domain.TodoList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TodoList entity.
 */
@Repository
public interface TodoListRepository extends JpaRepository<TodoList, Long> {
    @Query("select todoList from TodoList todoList where todoList.user.login = ?#{principal.username}")
    List<TodoList> findByUserIsCurrentUser();

    @Query(
        value = "select todoList from TodoList todoList where todoList.user.login = ?#{principal.username}",
        countQuery = "select count(distinct todoList) from TodoList todoList where todoList.user.login = ?#{principal.username}"
    )
    Page<TodoList> findByUserIsCurrentUser(Pageable pageable);

    default Optional<TodoList> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TodoList> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TodoList> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct todoList from TodoList todoList left join fetch todoList.user",
        countQuery = "select count(distinct todoList) from TodoList todoList"
    )
    Page<TodoList> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct todoList from TodoList todoList left join fetch todoList.user")
    List<TodoList> findAllWithToOneRelationships();

    @Query("select todoList from TodoList todoList left join fetch todoList.user where todoList.id =:id")
    Optional<TodoList> findOneWithToOneRelationships(@Param("id") Long id);
}

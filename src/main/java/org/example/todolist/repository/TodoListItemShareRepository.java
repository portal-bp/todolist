package org.example.todolist.repository;

import java.util.List;
import java.util.Optional;
import org.example.todolist.domain.TodoListItemShare;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TodoListItemShare entity.
 */
@Repository
public interface TodoListItemShareRepository extends JpaRepository<TodoListItemShare, Long> {
    default Optional<TodoListItemShare> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TodoListItemShare> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TodoListItemShare> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct todoListItemShare from TodoListItemShare todoListItemShare left join fetch todoListItemShare.todoListItem left join fetch todoListItemShare.user",
        countQuery = "select count(distinct todoListItemShare) from TodoListItemShare todoListItemShare"
    )
    Page<TodoListItemShare> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct todoListItemShare from TodoListItemShare todoListItemShare left join fetch todoListItemShare.todoListItem left join fetch todoListItemShare.user"
    )
    List<TodoListItemShare> findAllWithToOneRelationships();

    @Query(
        "select todoListItemShare from TodoListItemShare todoListItemShare left join fetch todoListItemShare.todoListItem left join fetch todoListItemShare.user where todoListItemShare.id =:id"
    )
    Optional<TodoListItemShare> findOneWithToOneRelationships(@Param("id") Long id);
}

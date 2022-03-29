package org.example.todolist.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TodoListItemShare.
 */
@Entity
@Table(name = "todo_list_item_share")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TodoListItemShare implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @JsonIgnoreProperties(value = { "todoList" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private TodoListItem todoListItem;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TodoListItemShare id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TodoListItem getTodoListItem() {
        return this.todoListItem;
    }

    public void setTodoListItem(TodoListItem todoListItem) {
        this.todoListItem = todoListItem;
    }

    public TodoListItemShare todoListItem(TodoListItem todoListItem) {
        this.setTodoListItem(todoListItem);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TodoListItemShare user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TodoListItemShare)) {
            return false;
        }
        return id != null && id.equals(((TodoListItemShare) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TodoListItemShare{" +
            "id=" + getId() +
            "}";
    }
}

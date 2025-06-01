package srn.golem.blog_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import srn.golem.blog_backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String userName);
}
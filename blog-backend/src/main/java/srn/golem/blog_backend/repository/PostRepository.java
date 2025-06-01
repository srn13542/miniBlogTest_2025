package srn.golem.blog_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import srn.golem.blog_backend.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long>{
} 

package srn.golem.blog_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import srn.golem.blog_backend.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
}
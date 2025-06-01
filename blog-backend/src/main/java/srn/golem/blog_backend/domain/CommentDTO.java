package srn.golem.blog_backend.domain;

import java.time.LocalDateTime;

import srn.golem.blog_backend.entity.Comment;

public class CommentDTO {
    public Long id;
    public String content;
    public LocalDateTime createdAt;
    public String username;

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.username = comment.getUser().getUsername();
    }
}
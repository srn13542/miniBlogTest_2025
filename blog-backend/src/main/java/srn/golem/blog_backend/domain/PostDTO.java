package srn.golem.blog_backend.domain;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import srn.golem.blog_backend.entity.Post;

@Getter
@Setter
public class PostDTO {
    public Long id;
    public String title;
    public String content;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public String username; // 작성자

    public PostDTO(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
        this.username = post.getUser().getUsername();
    }
}

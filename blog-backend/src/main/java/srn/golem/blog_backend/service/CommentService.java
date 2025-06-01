package srn.golem.blog_backend.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import srn.golem.blog_backend.domain.CommentDTO;
import srn.golem.blog_backend.domain.PostDTO;
import srn.golem.blog_backend.entity.Comment;
import srn.golem.blog_backend.entity.Post;
import srn.golem.blog_backend.entity.User;
import srn.golem.blog_backend.repository.CommentRepository;
import srn.golem.blog_backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    //오류 방지 위해 null 시 default로... 실제 앱에서는 로그인된 사용자로 대체해야 한다고 함
    public CommentDTO createComment(Comment comment) {
    // 임시로 Comment를 지정 (실제 앱에서는 로그인된 사용자로 대체)
        User user = userRepository.findById(44L) 
            .orElseThrow(() -> new RuntimeException("작성자 없음"));
        comment.setUser(user); //  유저 설정
        comment.setCreatedAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(comment);
        return new CommentDTO(savedComment);
    }
}

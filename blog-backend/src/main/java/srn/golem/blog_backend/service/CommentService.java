package srn.golem.blog_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import srn.golem.blog_backend.domain.CommentDTO;
import srn.golem.blog_backend.entity.Comment;
import srn.golem.blog_backend.entity.User;
import srn.golem.blog_backend.repository.CommentRepository;
import srn.golem.blog_backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    //오류 방지 위해 null 시 default로... 실제 앱에서는 로그인된 사용자로 대체하려 함
    @Transactional
    public CommentDTO createComment(Comment comment) {
        if(comment.getUser() == null || comment.getUser().getId() == null) {
            User anonymousUser = userRepository.findByUsername("guest");
            if (anonymousUser == null) {
                throw new RuntimeException("기본 익명 유저를 찾을 수 없습니다");
            }
            comment.setUser(anonymousUser);
        }
        comment.setCreatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);
        return new CommentDTO(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream().map(CommentDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    //수정 메서드 
    @Transactional
    public CommentDTO updateComment(Long commentId, String updatedContent) {
        //객체를 가져오거나 존재하지 않으면 예외 발생
        Comment comment = commentRepository.findById(commentId)
                            .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        //댓글 내용 수정
        comment.setContent(updatedContent);
        
        //저장 후 DTO로 변환
        Comment savComment = commentRepository.save(comment);
        return new CommentDTO(savComment);
    }
}

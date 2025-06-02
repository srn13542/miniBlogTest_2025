package srn.golem.blog_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import srn.golem.blog_backend.domain.CommentDTO;
import srn.golem.blog_backend.entity.Comment;
import srn.golem.blog_backend.entity.Post;
import srn.golem.blog_backend.service.CommentService;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")  //모든 도메인에서 접근 가능
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    // 댓글 작성: POST http://localhost:8080/api/posts/{postId}/comments
    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentDTO> createComment(@PathVariable("postId") Long postId, @RequestBody Comment comment) {
        comment.setPost(new Post());
        comment.getPost().setId(postId);
        CommentDTO createdComment = commentService.createComment(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }

    // 추가: 댓글 조회, 수정, 삭제 엔드포인트 등
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentDTO>> getCommentsByPostId(@PathVariable("postId") Long postId) {
        List<CommentDTO> commentDTOs = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(commentDTOs);
    }

    //댓글 수정 PATCH http://localhost:8080/api/posts/{postId}/comments/{commentId}
    @PatchMapping("/{postId}/comments/{commentId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId, @RequestBody Comment updatedComment) {
        //updatedComment.getComtent()에 새 내용이 들어있다고 가정함
        CommentDTO updatedCommentDTO = commentService.updateComment(commentId, updatedComment.getContent());
        return ResponseEntity.ok(updatedCommentDTO);
    }

    //댓글 삭제
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId) {
        //postId는 선택적 검증을 위해 사용할 수 있다?
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}

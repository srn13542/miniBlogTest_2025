package srn.golem.blog_backend.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import srn.golem.blog_backend.domain.PostDTO;
import srn.golem.blog_backend.entity.Post;
import srn.golem.blog_backend.entity.User;
import srn.golem.blog_backend.repository.PostRepository;
import srn.golem.blog_backend.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional; 

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;  // User 엔티티 접근을 위한 Repository
    @Autowired
    private PasswordEncoder passwordEncoder;
    

    @Transactional(readOnly = true)
    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostDTO getPostById(Long id) {
        return postRepository.findById(id)
                .map(PostDTO::new)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }


    //오류 방지 위해 null 시 default로... 실제 앱에서는 로그인된 사용자로 대체해야 한다고 함
    @Transactional
    public PostDTO createPost(Post post) {
        // 클라이언트에서 전달한 사용자 정보 무시하고, 소유자 계정(id=44)을 할당
        User owner = userRepository.findById(44L)
                        .orElseThrow(() -> new RuntimeException("Owner not found"));
        post.setUser(owner);

        Post savedPost = postRepository.save(post);
        return new PostDTO(savedPost);
    }

    @Transactional
    public void register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    //게시글 수정 메소드
    @Transactional
    public PostDTO updatePost(Long id, Post updatedPost) {
        Post existingPost = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        //필요한 필드 업데이트
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());

        //updateAt같은 필드 업데이트.. 
        existingPost.setUpdatedAt(LocalDateTime.now());
        Post savedPost = postRepository.save(existingPost);
        return new PostDTO(savedPost);
    }

    //게시글 삭제 메소드
    @Transactional
    public void deletePost(Long id) {
        if(!postRepository.existsById(id)) {
            throw new RuntimeException("삭제하려는 게시글이 존재하지 않습니다.");
        }
        postRepository.deleteById(id);
    }
}

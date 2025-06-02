package srn.golem.blog_backend.service;


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

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;  // User 엔티티 접근을 위한 Repository
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
    }

    public PostDTO getPostById(Long id) {
        return postRepository.findById(id)
                .map(PostDTO::new)
                .orElseThrow(() -> new RuntimeException("Post not Found"));
    }

    //오류 방지 위해 null 시 default로... 실제 앱에서는 로그인된 사용자로 대체해야 한다고 함
    public PostDTO createPost(Post post) {
        // 클라이언트에서 전달한 사용자 정보 무시하고, 소유자 계정(id=44)을 할당
        User owner = userRepository.findById(44L)
                        .orElseThrow(() -> new RuntimeException("Owner not found"));
        post.setUser(owner);

        Post savedPost = postRepository.save(post);
        return new PostDTO(savedPost);
    }

    public void register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }
}

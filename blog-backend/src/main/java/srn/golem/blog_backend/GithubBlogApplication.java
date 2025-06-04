package srn.golem.blog_backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import srn.golem.blog_backend.entity.User;
import srn.golem.blog_backend.service.CommentService;
import srn.golem.blog_backend.service.PostService;
import srn.golem.blog_backend.service.UserService;

@SpringBootApplication
public class GithubBlogApplication implements CommandLineRunner{

	@Autowired
	PostService postService;
	@Autowired
	CommentService commentService;
	@Autowired
	UserService userService;

	private static Logger logger = (Logger) LoggerFactory.getLogger(GithubBlogApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(GithubBlogApplication.class, args);
	}

	public void run (String... args) throws Exception {
		logger.info ("안녕하세요 mini Blog Project- JPA");

		User user = new User();
    	user.setUsername("admin");
    	user.setEmail("admin@example.com");
    	user.setPassword("password123");

    	try {
        	userService.register(user);  // 이 메서드는 @Transactional
    	} catch (Exception e) {
        	logger.error("초기 등록 중 오류 발생", e);
    	}

    	logger.info("초기화 완료");
	}
}

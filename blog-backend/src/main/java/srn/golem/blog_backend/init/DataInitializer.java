package srn.golem.blog_backend.init;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import srn.golem.blog_backend.entity.User;
import srn.golem.blog_backend.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        String username = "testuser";
        if (!userRepository.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setEmail("testuser@example.com");
            user.setPassword("password");
            userRepository.save(user);
        }
    }
}

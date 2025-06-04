package srn.golem.blog_backend;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import srn.golem.blog_backend.entity.Comment;
import srn.golem.blog_backend.entity.Post;
import srn.golem.blog_backend.repository.CommentRepository;
import srn.golem.blog_backend.repository.PostRepository;

@SpringBootTest
public class JpaTest {

    @Autowired(required = true)
    private PostRepository postRep;

    @Autowired(required = true)
    private CommentRepository commRep;

    private static Logger logger = LoggerFactory.getLogger(JpaTest.class);

    @Test
    public void testJpa() throws Exception {
        List<Post> listPost;  //Post Entity
        List<Comment> listComment; //Comment Entity

        try {
            listPost = postRep.findAll();
            logger.info("게시글 목록 :: listPost.toString() : " + listPost.toString());

            listComment = commRep.findAll();
            logger.info("댓글 목록 :: listComment.toString() " + listComment.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

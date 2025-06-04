package srn.golem.blog_backend;

import java.sql.Connection;

import javax.sql.DataSource;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class DataSourceTest {
    @Autowired
    private DataSource ds;

    private static Logger logger = LoggerFactory.getLogger(DataSourceTest.class);

    @Test
    public void testConnection() throws Exception {
        try (Connection con = ds.getConnection()) {
            logger.info("test Connection :: " + con);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

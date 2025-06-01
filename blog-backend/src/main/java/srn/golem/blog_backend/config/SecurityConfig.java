package srn.golem.blog_backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 비활성화: REST API + Postman 테스트를 위해
            .cors(cors -> {}) // cors() 활성화
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/**").permitAll()      // 회원가입, 로그인 등 허용
                .requestMatchers("/api/posts/**").permitAll()      // 게시글 관련 API 모두 허용
                .requestMatchers("/api/comments/**").authenticated() // 댓글 관련 API는 인증 필요
                .anyRequest().authenticated()                     // 그 외는 인증 필요
            )
            .formLogin(form -> form.disable())      // REST API에선 폼 로그인 사용 안 함
            .httpBasic(httpBasic -> httpBasic.disable()); // 기본 인증도 끔 (JWT 기반 인증 준비용)

        return http.build();
    }

        // 비밀번호 암호화용 빈 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.setAllowedOrigins(List.of("http://localhost:3000")); // React 앱 주소
    config.setAllowedHeaders(List.of("*"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
}
// src/components/Post.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../css/Post.css";

function Post() {
    const { id } = useParams(); // URL에서 id 파라미터 추출
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [comment, setComment] = useState(""); // 댓글 입력 필드 상태

    useEffect(() => {
        fetch(`http://localhost:8080/api/posts/${id}`)
            .then(res => {
        if (!res.ok) {
            throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        return res.json();
    })
        .then(data => {
            setPost(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <p id="loading">로딩중...</p>;
    if (error) return <p id="error">에러 발생: {error}</p>;
    if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

    return (
        <div className="postDetail" style={{ padding: "2rem" }}>
            <h2 className="postTitle">{post.title}</h2>
            <p className="postContent">{post.content}</p>
            <small className="postDate">
                {post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}
            </small>
            <div style={{ marginTop: "1rem" }}>
                <button onClick={() => navigate(-1)}>뒤로가기</button>
            </div>

             {/* 댓글 작성 UI */}
            <div className="commentBox">
                <h3>댓글 작성</h3>
                <textarea
                    className="commentInput"
                    placeholder="댓글을 입력하세요..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)} />
                <button style={{ marginTop: "0.5rem" }}>댓글 작성</button>
            </div>
        </div>
    );
}

export default Post;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../css/PostList.css";

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);  // 로딩 상태 
    const [error, setError] = useState(null);      // 에러 상태 

    useEffect(() => {
        fetch("http://localhost:8080/api/posts")
        .then(res => {
            if(!res.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }
            return res.json();
        })
        .then(data => {
            setPosts(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <p id="loading">로딩중 ... </p>;
    if (error) return <p id ="error">에러 발생: {error}</p>;

    return (
        <div className ="outlineBox" style={{ padding: "2rem" }}>
            {posts.map(post => (
                <Link
                    to = {`/post/${post.id}`}
                    key = {post.id}
                    className = "inlineBox"
                    style = {{
                        marginBottom: "1.5rem",
                        display: "block",
                        textDecoration: "none",
                        color: "inherit"
                    }}>
                    <h2 className = "postTitle">{post.title}</h2>
                    <p className = "postContent">{post.content}</p>
                    <small className = "postDate">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</small>
                </Link>
            ))}
        </div>
    );
}

export default PostList;
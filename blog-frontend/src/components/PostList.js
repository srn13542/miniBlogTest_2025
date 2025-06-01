import React, { useEffect, useState } from 'react';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);  // 로딩 상태 추가
    const [error, setError] = useState(null);      // 에러 상태 추가

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

    if (loading) return <p>로딩중 ... </p>;
    if (error) return <p>에러 발생: {error}</p>;

    return (
        <div style={{ padding: "2rem" }}>
            {posts.map(post => (
                <div key={post.id} style={{ marginBottom: "1.5rem" }}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <small>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</small>
                </div>
            ))}
        </div>
    );
}

export default PostList;
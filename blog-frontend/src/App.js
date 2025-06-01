import React, { useEffect, useState } from 'react';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📘 My Blog</h1>
      {posts.map(post => (
        <div key={post.id} style={{ marginBottom: "1.5rem" }}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>{new Date(post.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from './components/PostList';
import Post from './components/Post';

function App() {
  return (
    <Router>
      <div>
        <h1>📘 My Blog</h1>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:id" element={<Post />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
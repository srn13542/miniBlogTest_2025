import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../css/PostList.css";

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);  // 로딩 상태 
    const [error, setError] = useState(null);      // 에러 상태 

    // 새 글 작성을 위한 상태
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");

    // 수정 모드 상태 (어떤 게시글이 수정 중인지와 수정할 제목, 내용을 관리)
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        fetch("http://localhost:8080/api/posts")
            .then(res => {
                if(!res.ok) {
                    throw new Error("네트워크 응답이 올바르지 않습니다.");
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
    };

    //새 글 등록 API 호출
    const handlePostSubmit = () => {
        
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }
        
        const newPost = {
            title: newPostTitle,
            content: newPostContent
        };

        fetch("http://localhost:8080/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPost)
        })
        .then(response => {
            if (!response.ok) throw new Error("게시글 작성에 실패했습니다.");
            return response.json();
        })
        .then(post => {
            alert("게시글 작성 완료!");
            setPosts([...posts, post]);   //기존 리스트에 새 게시글 추가
            setNewPostTitle("");
            setNewPostContent(""); //초기화
        })
        .catch(error => {
            alert(error.message);
        });
    };


    //수정 모드 전환: 해당 게시글의 현재 제목과 내용을 편집 상태에 표시
    const handlePostEdit = (post) => {
        setEditingPostId(post.id);
        setEditedTitle(post.title);
        setEditedContent(post.content);
    };


    //게시글 수정 API 호출
    const handlePostUpdate = (postId) => {
        if (!editedTitle.trim() || !editedContent.trim()) {
            alert("제목과 내용을 입력해주세요");
            return;
        }

        const updatedPost = {
            title: editedTitle,
            content: editedContent
        };

        fetch(`http://localhost:8080/api/posts/${postId}`, {
            method: "PATCH", //PostController에서 Patch 메소드 구현 예정
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPost)
        })
        .then(response => {
            if(!response.ok) throw new Error("게시글 수정에 실패했습니다.");
            return response.json();
        })
        .then(data => {
            alert("게시글 수정 완료");
            setPosts(posts.map(post => post.id === postId ? data : post));
            setEditingPostId(null);
            setEditedTitle("");
            setEditedContent("");
        })
        .catch(error => {
            alert(error.message);
        });
    };

    //게시글 삭제 api 호출
    const handlePostDelete = (postId) => {

        if (!window.confirm("정말로 삭제하시겠습니까?")) return;

        fetch(`http://localhost:8080/api/posts/${postId}`, {
            method: "DELETE"
        })
        .then(response => {
            if(!response.ok) throw new Error("게시글 삭제에 실패했습니다.");
            return response;
        })
        .then(() => {
            alert("게시글이 삭제되었습니다.");
            setPosts(posts.filter(post => post.id !== postId));
        })
        .catch(error => {
            alert(error.message);
        });
    };


    if (loading) return <div className="loading-container"><p className="loading-text">로딩중...</p></div>;
    if (error) return <div className="error-container"><p className="error-text">에러 발생: {error}</p></div>;



    return (
        <div className="blog-container">
            <div className="blog-header">
                <h1 className="blog-title">My Blog</h1>
                <p className="blog-subtitle">{/*쓸 말이 안 떠오름*/}</p>
            </div>

            {/* 새 글 작성 영역 */}
            <div className="new-post-section">
                <h2 className="section-title">새 글 작성</h2>
                <div className="new-post-form">
                    <input
                        type="text"
                        className="post-title-input"
                        placeholder="제목을 입력하세요"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                    <textarea
                        className="post-content-input"
                        placeholder="내용을 입력하세요"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        rows="5"
                    />
                    <button className="btn btn-primary" onClick={handlePostSubmit}>
                        게시글 작성
                    </button>
                </div>
            </div>

            {/* 게시글 목록 */}
            <div className="posts-section">
                <h2 className="section-title">게시글 목록</h2>
                {posts.length === 0 ? (
                    <div className="empty-state">
                        <p>아직 작성된 게시글이 없습니다.</p>
                    </div>
                ) : (
                    <div className="posts-grid">
                        {posts.map(post => (
                            <div key={post.id} className="post-card">
                                {editingPostId === post.id ? (
                                    <div className="edit-mode">
                                        <input
                                            type="text"
                                            className="edit-title-input"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                        />
                                        <textarea 
                                            className="edit-content-input"
                                            value={editedContent} 
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            rows="4"
                                        />
                                        <div className="edit-actions">
                                            <button className="btn btn-success" onClick={() => handlePostUpdate(post.id)}>
                                                저장
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => setEditingPostId(null)}>
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="post-content">
                                        <Link to={`/post/${post.id}`} className="post-link">
                                            <h3 className="post-title">{post.title}</h3>
                                            <p className="post-preview">{post.content}</p>
                                            <div className="post-meta">
                                                <span className="post-date">
                                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }) : ''}
                                                </span>
                                            </div>
                                        </Link>
                                        <div className="post-actions">
                                            <button className="btn btn-edit" onClick={() => handlePostEdit(post)}>
                                                수정
                                            </button>
                                            <button className="btn btn-delete" onClick={() => handlePostDelete(post.id)}>
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostList;
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


    if (loading) return <p id="loading">로딩중 ... </p>;
    if (error) return <p id ="error">에러 발생: {error}</p>;


    return (
        <div className ="postListContainer" style={{ padding: "2rem" }}>
            <h2 className = "pageTitle" >게시글 목록</h2>
            {/*새 글 작성 영역*/}
            <div className = "newPostCard" style = {{ marginBottom: "2rem", border: "1px solid #ccc", padding: "1rem" }}>
                <h3>새 글 작성</h3>
                <input
                    type = "text"
                    placeholder = "제목을 입력하세요"
                    value = {newPostTitle}
                    onChange = {(e) => setNewPostTitle(e.target.value)} />
                <textarea
                    placeholder = "내용을 입력하세요"
                    value = {newPostContent}
                    onChange = {(e) => setNewPostContent(e.target.value)} />
                <buttom onClick = {handlePostSubmit}> 게시글 작성 </buttom>
            </div>

            {/* 게시글 목록 */}
            <div className = "postsContainer">
            {posts.map(post => (
                <div key={post.id} className="postCard" style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
                    {editingPostId === post.id ? (
                        <>
                        {/* 수정 모드 */}
                            <input
                                type = "text"
                                value = {editedTitle}
                                onChange = {(e) => setEditedTitle(e.target.value)}
                                className = "editTitle" />
                            <textarea 
                                value={editedContent} 
                                onChange={(e) => setEditedContent(e.target.value)}
                                className = "editContent" />
                            <div className = "editButtons">
                                <button className = "btn btn-save" onClick={() => handlePostUpdate(post.id)}>저장</button>
                                <button className = "btn btn-cancel" onClick={() => setEditingPostId(null)}>취소</button>
                            </div>
                        </>
                    ) : (
                         <>  {/* 일반 모드 */}
                            <Link
                                to={`/post/${post.id}`} className = "postLink" >
                                <h2 className="postTitle">{post.title}</h2>
                                <p className="postContent">{post.content}</p>
                                <small className="postDate">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</small>
                            </Link>
                            <div className = "postButtons">
                                <button className = "btn btn-edit" onClick={() => handlePostEdit(post)}>수정</button>
                                <button className = "btn btn-delete" onClick={() => handlePostDelete(post.id)}>삭제</button>
                            </div>
                        </>
                    )}
                </div>
            ))}
            </div>
        </div>
    );
}

export default PostList;
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
    const [comments, setComments] = useState([]); // 댓글 입력 필드 상태

    //댓글 입력 상태용 변수
    const [commentText, setCommentText] = useState("");

    //수정 모드 확인용 상태
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingText, setEditingText] = useState("");

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


    //------ 목록 불러오기 ------

    const fetchComments = () => {
        fetch(`http://localhost:8080/api/posts/${id}/comments`)
            .then(res  => {
                if (!res.ok) throw new Error('댓글 불러오기 실패');
                return res.json();
            })
            .then(data => {
                setComments(data);
            })
            .catch(err => {
                console.error("댓글 불러오기 에러:", err);
            });
    };

    useEffect(() => {
        fetchComments();
    }, [id]);


    //댓글 작성 API 호출 함수
    const handleCommentSubmit = () => {
        //백엔드에서 회원 정보를 저장하지 않으면, default로 익명 유저를 지정하도록 처리
        //만약 입력값이 비어있거나 공백인 경우
        if(!commentText.trim()) {
            alert("댓글을 작성해주십시오.");
            return;
        }

        const newComment = {
            content: commentText,   //관계 설정: post 필드 안에 id만 전달해 매핑
            post: {id: post.id}     //user 필드는 전달하지 않거나 null로 두면 백엔드에서 default로 처리리
        };

        fetch(`http://localhost:8080/api/posts/${post.id}/comments`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(newComment)
        })
        .then(response => {
            if(!response.ok) throw new Error("댓글 작성에 실패했습니다.");
            return response.json();
        })
        .then(data => {
            setCommentText("");  //입력창 초기화
            fetchComments(); //댓글 목록을 상태에 반영하거나 새로 고침 처리
        })
        .catch(error => {
            alert(error.message);
        });
    };

    //댓글 삭제 API 요청 함수
    const handleCommentDelete = (commentId) => {

        if (!window.confirm("정말로 댓글을 삭제하시겠습니까?")) return;

        fetch(`http://localhost:8080/api/posts/${post.id}/comments/${commentId}`, {
            method: "DELETE",
            header: {
                "Content-Type" : "application/json"
            }
        })
        .then(response => {
            if(!response.ok) throw new Error("댓글 삭제에 실패했습니다.");
            return response.text().then(text => text ? JSON.parse(text): {});
        })
        .then(() => {
            setComments(prevComments => prevComments.filter(c => c.id !== commentId));
        })
        .catch(error => {
            alert(error.message);
        });
    };

    //댓글 수정 API 호출
    const handleCommentUpdate = (commentId) => {
        if( !editingText.trim() ) {
            alert("수정할 댓글 내용을 입력해주십시오.");
            return;
        }
        fetch(`http://localhost:8080/api/posts/${post.id}/comments/${commentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: editingText })
        })
        .then(response => response.json()) //json 변환 먼저 수행
        .then( updatedComment => {
            //상태 업데이트: 해당 댓글을 수정된 내용으로 교체
            setComments(prevComments => prevComments.map(c => c.id === commentId ? updatedComment : c));
            setEditingCommentId(null);
            setEditingText("");
        })
        .catch( error => {
            alert(error.message);
        });
    };

    if (loading) return <div className="loading-container"><p className="loading-text">로딩중...</p></div>;
    if (error) return <div className="error-container"><p className="error-text">에러 발생: {error}</p></div>;
    if (!post) return <div className="error-container"><p className="error-text">게시글을 찾을 수 없습니다.</p></div>;


    return (
        <div className="post-detail-container">
            {/* 게시글 헤더 */}
            <div className="post-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← 목록으로
                </button>
            </div>

            {/* 게시글 내용 */}
            <article className="post-article">
                <header className="article-header">
                    <h1 className="article-title">{post.title}</h1>
                    <div className="article-meta">
                        <span className="article-date">
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : ''}
                        </span>
                    </div>
                </header>
                <div className="article-content">
                    <p>{post.content}</p>
                </div>
            </article>

            {/* 댓글 섹션 */}
            <section className="comments-section">
                <div className="comments-header">
                    <h2 className="comments-title">댓글 {comments.length}개</h2>
                </div>

                {/* 댓글 작성 폼 */}
                <div className="comment-form">
                    <h3 className="form-title">댓글 작성</h3>
                    <textarea
                        className="comment-textarea"
                        placeholder="댓글을 입력하세요..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows="4"
                    />
                    <button className="btn btn-primary comment-submit" onClick={handleCommentSubmit}>
                        댓글 작성
                    </button>
                </div>

                {/* 댓글 목록 */}
                <div className="comments-list">
                    {comments.length === 0 ? (
                        <div className="empty-comments">
                            <p>아직 댓글이 없습니다.</p>
                        </div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                                {editingCommentId === comment.id ? (
                                    <div className="comment-edit-mode">
                                        <textarea 
                                            className="comment-edit-textarea"
                                            value={editingText} 
                                            onChange={(e) => setEditingText(e.target.value)}
                                            rows="3"
                                        />
                                        <div className="comment-edit-actions">
                                            <button className="btn btn-success btn-sm" onClick={() => handleCommentUpdate(comment.id)}>
                                                저장
                                            </button>
                                            <button className="btn btn-secondary btn-sm" onClick={() => {
                                                setEditingCommentId(null); 
                                                setEditingText("");
                                            }}>
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="comment-display">
                                        <div className="comment-content">
                                            <p>{comment.content}</p>
                                        </div>
                                        <div className="comment-meta">
                                            <span className="comment-author">
                                                작성자: {comment.username || '익명'}
                                            </span>
                                            <span className="comment-date">
                                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : ''}
                                            </span>
                                        </div>
                                        <div className="comment-actions">
                                            <button className="btn btn-edit btn-sm" onClick={() => { 
                                                setEditingCommentId(comment.id); 
                                                setEditingText(comment.content); 
                                            }}>
                                                수정
                                            </button>
                                            <button className="btn btn-delete btn-sm" onClick={() => handleCommentDelete(comment.id)}>
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default Post;
import React from 'react';

export function CommentsSection({ postId, userInfo }) {
    const [comments, setComments] = React.useState([]);
    const [showComments, setShowComments] = React.useState(false);
    const [commentText, setCommentText] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    // Fetch comments when section is opened
    React.useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments, postId]);

    // Listen for WebSocket comment updates
    React.useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${protocol}//${window.location.host}`);
        
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            if (message.type === 'commentCreate' && message.postId === postId) {
                setComments(prev => [...prev, message.comment]);
            } else if (message.type === 'commentDelete' && message.postId === postId) {
                setComments(prev => prev.filter(c => c._id !== message.commentId));
            }
        };
        
        return () => ws.close();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/comments/${postId}`);
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        
        if (!userInfo) {
            alert('You must be logged in to comment');
            return;
        }

        if (!commentText.trim()) {
            return;
        }

        try {
            const response = await fetch(`/api/comments/${postId}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: commentText })
            });

            if (response.ok) {
                setCommentText('');
                fetchComments();
            } else if (response.status === 401) {
                alert('You must be logged in to comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) {
            return;
        }

        try {
            const response = await fetch(`/api/comments/${postId}/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                fetchComments();
            } else if (response.status === 403) {
                alert('You can only delete your own comments');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const formatCommentTime = (timestamp) => {
        const now = new Date();
        const commentTime = new Date(timestamp);
        const diffMs = now - commentTime;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);

        if (diffSeconds < 60) {
            return 'just now';
        } else if (diffMinutes === 1) {
            return '1 minute ago';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minutes ago`;
        } else if (diffHours === 1) {
            return '1 hour ago';
        } else if (diffHours < 24) {
            return `${diffHours} hours ago`;
        } else {
            return commentTime.toLocaleDateString();
        }
    };

    return (
        <div className="comments-section">
            <button 
                className="toggle-comments-btn"
                onClick={() => setShowComments(!showComments)}
            >
                {showComments ? 'Hide Comments' : `Show Comments (${comments.length})`}
            </button>

            {showComments && (
                <div className="comments-container">
                    {/* Comment form - only show if logged in */}
                    {userInfo && (
                        <form onSubmit={handleSubmitComment} className="comment-form">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="comment-input"
                                rows="2"
                            />
                            <button type="submit" className="comment-submit-btn">
                                Post Comment
                            </button>
                        </form>
                    )}

                    {!userInfo && (
                        <p className="login-prompt">
                            <a href="/login">Log in</a> to comment
                        </p>
                    )}

                    {/* Comments list */}
                    {loading && <p>Loading comments...</p>}
                    
                    {!loading && comments.length === 0 && (
                        <p className="no-comments">No comments yet</p>
                    )}

                    {!loading && comments.length > 0 && (
                        <div className="comments-list">
                            {comments.map(comment => (
                                <div key={comment._id} className="comment">
                                    <div className="comment-header">
                                        <span className="comment-author">{comment.username}</span>
                                        <span className="comment-time">
                                            {formatCommentTime(comment.timestamp)}
                                        </span>
                                    </div>
                                    <p className="comment-text">{comment.text}</p>
                                    {userInfo && userInfo.email === comment.email && (
                                        <button
                                            className="delete-comment-btn"
                                            onClick={() => handleDeleteComment(comment._id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

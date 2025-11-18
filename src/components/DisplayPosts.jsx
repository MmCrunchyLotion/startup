import React from 'react';
import { useLocation } from 'react-router-dom';

export function DisplayPosts() {
    const [posts, setPosts] = React.useState([]);
    const routeLocation = useLocation();
    const location = routeLocation.pathname;

    const handleGetPosts = async () => {
        try {
            const res = await fetch('/api/posts', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                if (location === '/events') {
                    const eventPosts = data.filter(post => post.type === 'event');
                    setPosts(eventPosts);
                } else {
                    setPosts(data);
                }
            }
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        }
    };

    React.useEffect(() => {
        handleGetPosts();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatTime = (timeString) => {
        // timeString is expected to be in HH:mm format (24-hour)
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12; // Convert 0 to 12 for midnight
        return `${String(displayHour).padStart(2, '0')}:${minutes} ${ampm}`;
    };

    const formatRelativeTime = (timestamp) => {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diffMs = now - postTime;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

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
        } else if (diffDays === 1) {
            return '1 day ago';
        } else {
            return `${diffDays} days ago`;
        }
    };

    const renderPost = (post) => {
        if (post.type === 'event') {
            return (
                <div key={post.id} className="post">
                    <div className="post-info">
                        <p className="username">{post.username}</p>
                        <p className="timestamp">{formatRelativeTime(post.timestamp)}</p>
                    </div>
                    <h3 className="post-title">{post.title}</h3>
                    <p className="event-date">Date: {formatDate(post.eventDate)}</p>
                    <p className="event-time">Time: {formatTime(post.time)}</p>
                    <p className="event-location">Location: {post.location}</p>
                    <p className="post-content">{post.content}</p>
                </div>
            );
        } else {
            return (
                <div key={post.id} className="post">
                    <div className="post-info">
                        <p className="username">{post.username}</p>
                        <p className="timestamp">{formatRelativeTime(post.timestamp)}</p>
                    </div>
                    <p className="post-content">{post.content}</p>
                    {/* TODO: Make button that will pull up details from a linked event post */}
                    {/* <p className="event-link"><i>{post.link}</i></p> */}
                </div>
            );
        }
    };

    return (
        <div className="posts-container">
            <button onClick={handleGetPosts} className="refresh-button">
                Refresh Posts
            </button>
            {posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(post => renderPost(post))
            )}
        </div>
    );
}
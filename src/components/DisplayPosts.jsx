import React from 'react';
import { useLocation } from 'react-router-dom';
import { CommentsSection } from './CommentsSection.jsx';

export function DisplayPosts() {
    const [posts, setPosts] = React.useState([]);
    const [userInfo, setUserInfo] = React.useState(null);
    const routeLocation = useLocation();
    const location = routeLocation.pathname;
    const wsRef = React.useRef(null);
    
    // WebSocket connection
    React.useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;
        
        try {
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;
            
            ws.onopen = () => {
                console.log('WebSocket connected');
            };
            
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                
                setPosts(prevPosts => {
                    let updatedPosts = [...prevPosts];
                    
                    if (message.type === 'postCreate') {
                        // Check if post should be shown on current page
                        if (shouldShowPost(message.post, location, userInfo)) {
                            updatedPosts.push(message.post);
                        }
                    } else if (message.type === 'postDelete') {
                        updatedPosts = updatedPosts.filter(p => p._id !== message.postId);
                    } else if (message.type === 'profileUpdate') {
                        // If on profile page and profile updated, refetch posts
                        if (location === '/profile') {
                            // Trigger refetch by updating a state
                        }
                    }
                    
                    return updatedPosts;
                });
            };
            
            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
            ws.onclose = () => {
                console.log('WebSocket disconnected');
            };
            
            return () => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            };
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
        }
    }, [location, userInfo]);
    
    // Helper to determine if post should be shown
    const shouldShowPost = (post, loc, info) => {
        if (loc === '/events') {
            return post.type === 'event';
        } else if (loc === '/profile') {
            return info && post.username === info.username;
        }
        return true;
    };
    
    // Fetch user info if on profile page
    React.useEffect(() => {
        if (location === '/profile') {
            fetch('/api/user', {
                credentials: 'include',
            })
                .then(res => res.json())
                .then(data => setUserInfo(data))
                .catch(err => console.error('Error fetching user info:', err));
        }
    }, [location]);
    
    React.useEffect(() => {
        // handleGetPosts();
        fetch('api/posts/')
            .then(res => res.json())
            .then(data => {
                // Filter posts based on current location
                if (location === '/events') {
                    setPosts(data.filter(post => post.type === 'event'));
                } else if (location === '/profile') {
                    // Only filter by username if we have the user info
                    if (userInfo && userInfo.username) {
                        setPosts(data.filter(post => post.username === userInfo.username));
                    } else {
                        // If no username, show no posts
                        setPosts([]);
                    }
                } else {
                    setPosts(data);
                }
            })
            .catch(err => console.error('Error fetching posts:', err));
    }, [location, userInfo]);

    const handleGetPosts = async () => {
        try {
// This gets all posts, good for testing, but with too many posts server will overload
            const res = await fetch('/api/posts', { 
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                if (location === '/events') {
                    const eventPosts = data.filter(post => post.type === 'event');
                    setPosts(eventPosts);
                } else if (location === '/profile') {
                    const userPosts = data.filter(post => post.username === userInfo?.username);
                    setPosts(userPosts);
                } else {
                    setPosts(data);
                }
            }
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        }
    };

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
                <div key={post._id} className="post">
                    <div className="post-info">
                        <p className="username">{post.username}</p>
                        <p className="timestamp">{formatRelativeTime(post.timestamp)}</p>
                    </div>
                    <h3 className="post-title">{post.title}</h3>
                    <p className="event-date">Date: {formatDate(post.eventDate)}</p>
                    <p className="event-time">Time: {formatTime(post.time)}</p>
                    <p className="event-location">Location: {post.location}</p>
                    <p className="post-content">{post.content}</p>
                    <CommentsSection postId={post._id} userInfo={userInfo} />
                </div>
            );
        } else {
            return (
                <div key={post._id} className="post">
                    <div className="post-info">
                        <p className="username">{post.username}</p>
                        <p className="timestamp">{formatRelativeTime(post.timestamp)}</p>
                    </div>
                    <p className="post-content">{post.content}</p>
                    <CommentsSection postId={post._id} userInfo={userInfo} />
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
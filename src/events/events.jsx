import React from 'react';
import { CreatePostForm } from '../components/CreatePostForm';
import { DisplayPosts } from '../components/DisplayPosts';

export function Events() {
    return (
        <main className="container-fluid text-center">
            <div className="outer-feed">
                <h2>Upcoming Events</h2>
                <div className="inner-feed">
                    <EventsDisplay />
                </div>
            </div>
        </main>
    );
}

function EventsDisplay() {
    const [posts, setPosts] = React.useState([]);

    const handleGetPosts = async () => {
        try {
            const res = await fetch('/api/posts', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                // Filter to only show event posts
                const eventPosts = data.filter(post => post.type === 'event');
                setPosts(eventPosts);
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
        if (!timeString) return '';
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

    return (
        <div className="posts-container">
            <button onClick={handleGetPosts} className="refresh-button">
                Refresh Events
            </button>
            {posts.length === 0 ? (
                <p>No events available</p>
            ) : (
                posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(post => (
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
                ))
            )}
            
            {/* Filler posts */}
            <div className="post">
                <div className="post-info">
                    <p className="username">Provo High Bulldogs</p>
                    <p className="timestamp">2 hours ago</p>
                </div>
                <h3>Summer Music Camp</h3>
                <p className="event-date">Date: June 15 - June 20</p>
                <p className="event-time">Time: 10:00 AM - 2:00 PM</p>
                <p className="event-location">Location: Provo High School (3rd party api)</p>
                <p className="post-content">Join us for a week of music, fun, and learning! Sign up now!</p>
            </div>
            <div className="post">
                <div className="post-info">
                    <p className="username">City Music Lovers</p>
                    <p className="timestamp">1 day ago</p>
                </div>
                <h3>Local Band Showcase</h3>
                <p>Date: July 10</p>
                <p>Time: 6:00 PM - 9:00 PM</p>
                <p>Location: Downtown Park (3rd party api)</p>
                <p>Come support local talent and enjoy an evening of great music!</p>
            </div>
            <div className="post">
                <div className="post-info">
                    <p className="username">GuitarGuru</p>
                    <p className="timestamp">3 days ago</p>
                </div>
                <h3>Music Workshop</h3>
                <p className="event-date">Date: July 10</p>
                <p className="event-time">Time: 10:00 AM - 4:00 PM</p>
                <p className="event-location">Location: GuitarLabs (3rd party api)</p>
                <p className="post-content">Come learn from the best! Free group guitar lessons for all skill levels. New students welcome!</p>
            </div>
        </div>
    );
}

export function EventsHeader() {
    const [showForm, setShowForm] = React.useState(false);

    const handleSubmit = (data) => {
        // TODO: replace with API call
        console.log('Submitted from shared form:', data);
        setShowForm(false);
    };
    
    return (
        <div className="content-header">
            <h1>Find music events!</h1>
            {!showForm ? (
                <button
                    className="btn btn-primary text-dark"
                    type="button"
                    style={{ backgroundColor: '#ff6347' }}
                    onClick={() => setShowForm(true)}
                >
                    Create new Post
                </button>
            ) : (
                <CreatePostForm initialData={{ type: 'event' }} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
            )}
        </div>
    );
}

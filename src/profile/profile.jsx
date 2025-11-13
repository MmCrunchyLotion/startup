import React from 'react';
import { PersonSearchForm } from '../components/PersonSearchForm';
import { ProfileEditForm } from '../components/ProfileEditForm';
import { useNavigate } from 'react-router-dom';

export function Profile({ userInfo, onLogout }) {
    const [showForm, setShowForm] = React.useState(false);

    const handleSubmit = (data) => {
        // TODO: replace with API call
        
        console.log('Submitted from shared form:', data);
        setShowForm(false);
    };

    return (
        <main className="container-fluid text-center">
            {/* <!-- need to implement a way to view other people's profiles, rather than just your own --> */}
            <div>
                <h1>Profile</h1>
                <div>Logged in as: {userInfo?.username || 'Loading...'}</div>
                <button type='button' onClick={onLogout}>
                    Logout
                </button>
            </div>
            <div className="outer-profile">
                <h1>Your Profile</h1>
                <div className="inner-profile">
                    <div className="your-card">
                        <img src="https://pbs.twimg.com/profile_images/1011280580015804420/yQ21pTwo_400x400.jpg" className="img-thumbnail" alt="User Photo" />
                        <div className="profile-info">
                            <p className="username">Username: Jazzman123</p>
                            <p className="bio">Bio: Passionate about music and looking to connect with fellow musicians!</p>
                            <p className="account-type">Account Type: User</p>
                            <p className="location">Location: Provo, UT</p>
                        </div>
                        {!showForm ? (
                            <button
                                className="btn btn-primary text-dark"
                                type="button"
                                style={{ backgroundColor: '#ff6347' }}
                                onClick={() => setShowForm(true)}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <ProfileEditForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
                        )}
                    </div>
                </div>
            </div>
            <div className="outer-feed">
                <h2>Your Posts (database)</h2>
                <div className="inner-feed">
                    <UserPostsDisplay username={userInfo?.username} />
                    {/* Filler post */}
                    <div className="post">
                        <div className="post-info">
                            <p className="username">Jazzman123</p>
                            <p className="timestamp">3 hours ago</p>
                        </div>
                        <p className="post-content">Excited for the upcoming band showcase! Come watch me perform!</p>
                        <p className="event-link"><i>Local Band Showcase</i></p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export function ProfileHeader() {
    const [showForm, setShowForm] = React.useState(false);

    const handleSubmit = (data) => {
        // TODO: replace with API call
        console.log('Submitted from shared form:', data);
        setShowForm(false);
    };

    return (
        <div className="content-header">
            <h1>Find someone else!</h1>
            {!showForm ? (
                <button
                    className="btn btn-primary text-dark"
                    type="button"
                    style={{ backgroundColor: '#ff6347' }}
                    onClick={() => setShowForm(true)}
                >
                    Search
                </button>
            ) : (
                <PersonSearchForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
            )}
        </div>
    );
}

function UserPostsDisplay({ username }) {
    const [posts, setPosts] = React.useState([]);

    const handleGetPosts = async () => {
        try {
            const res = await fetch('/api/posts', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                // Filter to only show posts by the current user
                const userPosts = data.filter(post => post.username === username);
                setPosts(userPosts);
            }
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        }
    };

    React.useEffect(() => {
        if (username) {
            handleGetPosts();
        }
    }, [username]);

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
        <>
            <button onClick={handleGetPosts} className="refresh-button" style={{ marginBottom: '1em' }}>
                Refresh Your Posts
            </button>
            {posts.length === 0 ? (
                <p>You haven't created any posts yet</p>
            ) : (
                posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(post => (
                    <div key={post.id} className="post">
                        <div className="post-info">
                            <p className="username">{post.username}</p>
                            <p className="timestamp">{formatRelativeTime(post.timestamp)}</p>
                        </div>
                        {post.type === 'event' && (
                            <>
                                <h3 className="post-title">{post.title}</h3>
                                <p className="event-date">Date: {formatDate(post.eventDate)}</p>
                                <p className="event-time">Time: {formatTime(post.time)}</p>
                                <p className="event-location">Location: {post.location}</p>
                            </>
                        )}
                        <p className="post-content">{post.content}</p>
                    </div>
                ))
            )}
        </>
    );
}
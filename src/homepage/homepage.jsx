import React from 'react';
import { CreatePostForm } from '../components/CreatePostForm';
import { DisplayPosts } from '../components/DisplayPosts';

export function Homepage() {
    return (
        <main className="container-fluid text-center">
            <div className="outer-feed">
                <h2>Your feed (websocket data)</h2>
                <div className="inner-feed">
                    <DisplayPosts />
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
                            <p className="username">Jazzman123</p>
                            <p className="timestamp">3 hours ago</p>
                        </div>
                        <p className="post-content">Excited for the upcoming band showcase! Come watch me perform!</p>
                        <p className="event-link"><i>Local Band Showcase</i></p>
                    </div>
                    <div className="post">
                        <div className="post-info">
                            <p className="username">GuitarGuru</p>
                            <p className="timestamp">5 hours ago</p>
                        </div>
                        <p className="post-content">Looking forward to the music workshop this weekend! New students welcome!</p>
                        <p className="event-link"><i>Music Workshop</i></p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export function HomepageHeader() {
    const [showForm, setShowForm] = React.useState(false);

    const handleSubmit = (data) => {
        createPost('POST', data);
        console.log('Submitted from shared form:', data);
        setShowForm(false);
    };

    async function createPost(method, data) {
        console.log('Creating post with data:', data);
        const res = await fetch('/api/posts', {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        await res.json();
        if (res.ok) {
            console.log('Post created successfully');
        } else {
            alert('Failed to create post');
        }
    }

    return (
        <div className="content-header">
            <h1>Welcome to Match your Music!</h1>
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
                <CreatePostForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
            )}
        </div>
    );
}
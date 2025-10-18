import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    return <div style={{backgroundColor: '#ff6347'}}>
        <header className="container-fluid">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Match your Music</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item"><a className="nav-link text-dark" href="index.html">Home</a></li>
                            <li className="nav-item"><a className="nav-link text-dark" href="teacher-finder.html">Find a teacher</a></li>
                            <li className="nav-item"><a className="nav-link text-dark" href="events.html">Events</a></li>
                            <li className="nav-item"><a className="nav-link text-dark" href="profile.html">Profile</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="content-header">
                <h1>Welcome to Match your Music!</h1>
                <button className="btn btn-primary text-dark" type="button" style={{backgroundColor: '#ff6347'}}>Create New Post</button>
            </div>
        </header>

        <main className="container-fluid text-center">
            <div className="outer-feed">
                <h2>Your feed (websocket data)</h2>
                <div className="inner-feed">
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

        <footer>
        <div className="container-fluid">
            <span className="text-reset">Dane Peterson</span>
            <a className="text-reset" href="https://github.com/MmCrunchyLotion/startup">GitHub Repository</a>
        </div>
        </footer>
    </div>;
}
import React from 'react';

export function Login() {
  return (
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
  );
}
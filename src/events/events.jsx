import React from 'react';

export function Events() {
  return (
    <main className="container-fluid text-center">
        {/* TODO: create a function in js that will display different posts from users, 
        automatically filtered to show events */}
        <div className="outer-feed">
            <h2>Upcoming Events (websocket data)</h2>
            <div className="inner-feed">
            {/* <!-- TODO: create a function in js that will display different posts from users --> */}
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
        </div>
    </main>
  );
}

export function EventsHeader() {
    return (
        <div className="content-header">
            <h1>Find music events!</h1>
            <button className="btn btn-primary text-dark" type="button" style={{backgroundColor: '#ff6347'}}>Create New Post</button>
        </div>
    );
}
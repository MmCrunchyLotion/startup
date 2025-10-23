import React from 'react';
import { NavLink } from 'react-router-dom';
import { CreatePostForm } from '../components/CreatePostForm';

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

export function LoginHeader() {
  const [showForm, setShowForm] = React.useState(false);

  const handleSubmit = (data) => {
    // TODO: replace with API call
    console.log('Submitted from shared form:', data);
    setShowForm(false);
  };

  return (
    <div className="content-header">
      <h1>Welcome to Match your Music!</h1>
      {!showForm ? (
        <button 
          className="btn btn-primary text-dark" 
          type="button" 
          style={{backgroundColor: '#ff6347'}}
          onClick={() => setShowForm(true)}
        >
          Create new Post
        </button>
      ) : (
            <CreatePostForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />

        // <form onSubmit={handleSubmit} className="post-form" style={{maxWidth: '500px', margin: 'auto', textAlign: 'left'}}>
        //   <div className="form-group mb-3">
        //     <label htmlFor="title">Title</label>
        //     <input
        //       type="text"
        //       className="form-control"
        //       id="title"
        //       name="title"
        //       value={postData.title}
        //       onChange={handleChange}
        //       placeholder="Enter post title"
        //       required
        //     />
        //   </div>
        //   <div className="form-group mb-3">
        //     <label htmlFor="content">Content</label>
        //     <textarea
        //       className="form-control"
        //       id="content"
        //       name="content"
        //       value={postData.content}
        //       onChange={handleChange}
        //       rows="3"
        //       placeholder="What's on your mind?"
        //       required
        //     />
        //   </div>
        //   <div className="form-group mb-3">
        //     <label htmlFor="eventDate">Event Date (optional)</label>
        //     <input
        //       type="date"
        //       className="form-control"
        //       id="eventDate"
        //       name="eventDate"
        //       value={postData.eventDate}
        //       onChange={handleChange}
        //     />
        //   </div>
        //   <div className="form-group mb-3">
        //     <label htmlFor="location">Location (optional)</label>
        //     <input
        //       type="text"
        //       className="form-control"
        //       id="location"
        //       name="location"
        //       value={postData.location}
        //       onChange={handleChange}
        //       placeholder="Enter event location"
        //     />
        //   </div>
        //   <div className="button-group" style={{display: 'flex', gap: '10px'}}>
        //     <button type="submit" className="btn btn-primary" style={{backgroundColor: '#ff6347'}}>
        //       Submit Post
        //     </button>
        //     <button 
        //       type="button" 
        //       className="btn btn-secondary"
        //       onClick={() => setShowForm(false)}
        //     >
        //       Cancel
        //     </button>
        //   </div>
        // </form>
      )}
    </div>
  );
}
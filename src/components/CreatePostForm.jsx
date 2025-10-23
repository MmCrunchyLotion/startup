import React from 'react';

export function CreatePostForm({ initialData = {}, onSubmit, onCancel }) {
    // initialData can have keys: title, content, eventDate, location
    const [postData, setPostData] = React.useState({
        type: initialData.type || 'general', 
        title: initialData.title || '',
        content: initialData.content || '',
        eventDate: initialData.eventDate || '',
        location: initialData.location || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(postData);
    };

    return (
        <form onSubmit={handleSubmit} className="post-form" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
            <div className="form-group mb-3">
                <label htmlFor="type">Post Type</label>
                <select
                    className="form-control"
                    id="type"
                    name="type"
                    value={postData.type}
                    onChange={handleChange}
                >
                    <option value="general">General Post</option>
                    <option value="event">Event</option>
                </select>
            </div>

            {postData.type === 'event' && (
                <div className="form-group mb-3">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={postData.title}
                        onChange={handleChange}
                        placeholder="Enter post title"
                        required
                    />
                </div>
            )}


            <div className="form-group mb-3">
                <label htmlFor="content">Content</label>
                <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    value={postData.content}
                    onChange={handleChange}
                    rows="4"
                    placeholder="What's on your mind?"
                    required
                />
            </div>

            {postData.type === 'event' && (
                <>
                    <div className="form-group mb-3">
                        <label htmlFor="eventDate">Event Date (optional)</label>
                        <input
                            type="date"
                            className="form-control"
                            id="eventDate"
                            name="eventDate"
                            value={postData.eventDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="location">Location (optional)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="location"
                            name="location"
                            value={postData.location}
                            onChange={handleChange}
                            placeholder="Enter event location"
                        />
                    </div>
                </>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#ff6347' }}>
                    Submit Post
                </button>
                {onCancel && (
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

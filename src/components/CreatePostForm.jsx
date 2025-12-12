import React from 'react';

export function CreatePostForm({ initialData = {}, onSubmit, onCancel }) {
    const [postData, setPostData] = React.useState({
        type: initialData.type || 'general', 
        title: initialData.title || '',
        content: initialData.content || '',
        eventDate: initialData.eventDate || '', // TODO: make this a date range
        eventTime: initialData.eventTime || '',
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

    const locationInputRef = React.useRef(null);

    React.useEffect(() => {
        if (!window.google) return;

        const autocomplete = new window.google.maps.places.Autocomplete(
            locationInputRef.current,
            {
                types: ["geocode"],
                fields: ["formatted_address", "geometry"],
            }
        );

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            setPostData(prev => ({ 
                ...prev, 
                location: place.formatted_address,
                latitude: place.geometry?.location.lat(),
                longitude: place.geometry?.location.lng()
            }));
        });
    }, [window.google]);


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
                        <label htmlFor="eventTime">Event Time (optional)</label>
                        <input
                            type="time"
                            className="form-control"
                            id="eventTime"
                            name="eventTime"
                            value={postData.eventTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            className="form-control"
                            id="location"
                            name="location"
                            ref={locationInputRef}
                            // value={postData.location}
                            // onChange={handleChange}
                            placeholder="Enter event location"
                            required
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

import React, { use } from 'react';

export function ProfileEditForm({ initialData = {}, onSubmit, onCancel }) {
    const [formData, setFormData] = React.useState({
        username: initialData.username || '',
        name: initialData.name || '',
        location: initialData.location || '',
        bio: initialData.bio || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="post-form" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
            <div className="form-group mb-3">
                <label htmlFor='username'>Username</label>
                <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Change your username"
                />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter a name"
                    required
                />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="bio">Bio</label>
                <input
                    type="text"
                    className="form-control"
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Enter a bio"
                />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="location">Location (This is private, and will help you find local events!)</label>
                <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter a zip code"
                />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#ff6347' }}>
                    Save Changes
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

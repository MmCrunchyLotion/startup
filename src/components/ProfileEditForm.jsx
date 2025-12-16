import React, { useState, useEffect } from 'react';

export function ProfileEditForm({ initialData = {}, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        accountType: initialData.accountType || 'User',
        username: initialData.username || '',
        email: initialData.email || '',
        name: initialData.name || '',
        bio: initialData.bio || '',
        zipcode: initialData.zipcode || '',
    });

    useEffect(() => {
        setFormData({
            accountType: initialData.accountType || 'User',
            username: initialData.username || '',
            email: initialData.email || '',
            name: initialData.name || '',
            bio: initialData.bio || '',
            zipcode: initialData.zipcode || '',
        });
    }, [initialData]);

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
                <label htmlFor="username">Username (optional)</label>
                <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter a username"
                />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    placeholder="Enter an email"
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
                <label htmlFor="zipcode">Location (This is private, and will help you find local events!)</label>
                <input
                    type="text"
                    className="form-control"
                    id="zipcode"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    placeholder="Enter a zip code"
                    required
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

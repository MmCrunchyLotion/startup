import React from 'react';
import { ProfileEditForm } from '../components/ProfileEditForm.jsx';
import { useNavigate } from 'react-router-dom';

export function ProfileSetup() {

    const navigate = useNavigate();
    const [userInfo, setUserInfo] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const fetchUserInfo = React.useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/user', {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setUserInfo(data);
                setError(null);
            } else {
                setError('Failed to load profile');
            }
        } catch (err) {
            console.error('Failed to fetch user info:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    const handleSubmit = (data) => {
        editProfile('PUT', data);
        console.log('Submitted from shared form:', data);
    };

    async function editProfile(method, data) {
        const res = await fetch('/api/user', {
            credentials: 'include',
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        if (res.ok) {
            console.log('Profile updated successfully');
            navigate('/profile');
        } else {
            const result = await res.json();
            alert(result.msg || 'Failed to update profile');
        }
    }

    return (
        <main className="container-fluid text-center">
            <h2>Profile Setup</h2>
            {loading ? (
                <p>Loading profile...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : userInfo ? (
                <ProfileEditForm initialData={{
                        username: userInfo.username, 
                        email: userInfo.email, 
                        name: userInfo.name, 
                        bio: userInfo.bio, 
                        zipcode: userInfo.zipcode
                    }}
                    onSubmit={handleSubmit} 
                    onCancel={() => navigate('/profile')}/>
            ) : (
                <p>No profile data available</p>
            )}
        </main>);
}

export function SetupHeader() {
    return (
        <div className="container-fluid">
            <h1>Setup Your Profile</h1>
        </div>
    );
}
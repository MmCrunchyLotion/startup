import React from 'react';
import { ProfileEditForm } from '../components/ProfileEditForm.jsx';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../app.jsx';

export function ProfileSetup() {

    const navigate = useNavigate();
    const username = getCookie('username');
    const [userInfo, setUserInfo] = React.useState({});

    const fetchUserInfo = React.useCallback(async () => {
        try {
            const res = await fetch('/api/user', {
                credentials: 'include',
            });
            const data = await res.json();
            setUserInfo(data);
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        }
    }, []);

    React.useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    const handleSubmit = (data) => {
        checkUsername(data);
        console.log('Submitted from shared form:', data);
    };
    
    const checkUsername = async (data) => {
        if (data.username === username) {
            editProfile('PUT', data);
            return;
        }
        const res = await fetch(`/api/user/${data.username}`, {
            method: 'GET',
            credentials: 'include',
        });
        await res.json();
        if (res.ok) {
            console.log('Username check successful');
            editProfile('PUT', data);
        } else {
            alert('Username already taken');
        }
    };

    async function editProfile(method, data) {
            const res = await fetch('/api/user', {
            credentials: 'include',
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        await res.json();
        if (res.ok) {
            console.log('Profile updated successfully');
            navigate('/profile');
        } else {
            alert('Failed to update profile');
        }
    }

    return (
        <main className="container-fluid text-center">
            <h2>Profile Setup</h2>
            <ProfileEditForm initialData={{
                    username: userInfo.username, 
                    email: userInfo.email, 
                    name: userInfo.name, 
                    bio: userInfo.bio, 
                    location: userInfo.location
                }}
                onSubmit={handleSubmit} 
                onCancel={() => navigate('/profile')}/>
        </main>);
}

export function SetupHeader() {
    return (
        <div className="container-fluid">
            <h1>Setup Your Profile</h1>
        </div>
    );
}
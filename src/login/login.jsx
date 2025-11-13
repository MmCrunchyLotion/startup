import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export function Login({ setIsAuthed }) {

    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleLogin() {
        createAuth('PUT');
    }

    function handleRegister() {
        createAuth('POST');
    }

    async function createAuth(method) {
        const res = await fetch('/api/auth', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });
        await res.json();
        if (res.ok) {
            console.log("Logged in");
            setIsAuthed(true);
            navigate('/profile');
        } else {
            alert('Authentication failed');
        }
    }

    return (
        <main className='container-fluid text-center'>
            <h1>Login</h1>
            <div className='username-container'>
                <label>Username:</label>
                <input type='text' onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className='password-container'>
                <label>Password:</label>
                <input type='password' onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type='submit' disabled={!(username && password)} onClick={handleLogin}>
                Login
            </button>
            <button type='button' disabled={!(username && password)} onClick={handleRegister}>
                Register
            </button>
        </main>
    );
}

function Profile({ setIsAuthed, checkAuth }) {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = React.useState('');

    React.useEffect(() => {
        (async () => {
            const res = await fetch('/api/user/me', {
                credentials: 'include',
            });
            const data = await res.json();
            setUserInfo(data);
        })();
    }, []);

    function handleLogout() {
        (async () => {
            try {
                const res = await fetch('/api/auth', {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (res.ok) {
                    console.log('Logged out successfully');
                    setIsAuthed(false);
                    navigate('/');
                } else {
                    console.error('Logout failed');
                    alert('Failed to logout');
                }
            } catch (err) {
                console.error('Logout error:', err);
                alert('Logout error');
            }
        })();
    }

    return (
        <div>
            <h1>Profile</h1>
            <div>Logged in as: {userInfo?.username || 'Loading...'}</div>
            <button type='button' onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}
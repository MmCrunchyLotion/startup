import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export function Login({ setIsAuthed }) {

    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
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
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            console.log("Authenticated");
            setIsAuthed(true);
            if (method === 'POST') {
                navigate('/profile-setup');
            } else {
                navigate('/profile');
            }
        } else {
            alert(data.msg || 'Authentication failed');
        }
    }

    return (
        <main className='container-fluid text-center'>
            <h1>Login</h1>
            <div className='username-container'>
                <label>Email:</label>
                <input type='email' onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className='password-container'>
                <label>Password:</label>
                <input type='password' onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type='submit' disabled={!(email && password)} onClick={handleLogin}>
                Login
            </button>
            <button type='button' disabled={!(email && password)} onClick={handleRegister}>
                Register
            </button>
        </main>
    );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export function Login() {

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
            body: JSON.stringify({ email, password }),
        });
        await res.json();
        if (res.ok) {
            console.log("Logged in");
            navigate('/profile');
        } else {
            alert('Authentication failed');
        }
    }

    return (
        <main className='container-fluid text-center'> 
            <h1>Login</h1>
            <div className='email-container'>
                <label>Email:</label>
                <input type='text' onChange={(e) => setEmail(e.target.value)} required />
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

function Profile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = React.useState('');

  React.useEffect(() => {
    (async () => {
      const res = await fetch('api/user/me');
      const data = await res.json();
      setUserInfo(data);
    })();
  }, []);

  function handleLogout() {
    fetch('api/auth', {
      method: 'DELETE',
    });
    navigate('/');
  }

  return (
    <div>
      <h1>Profile</h1>
      <div>Logged in as: {userInfo.email}</div>
      <button type='button' onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
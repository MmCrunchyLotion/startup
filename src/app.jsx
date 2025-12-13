import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiKeys from '../service/apiKeys.json';
import React from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Events, EventsHeader } from './events/events.jsx';
import { FindTeacher, TeacherFinderHeader } from './teacher-finder/teacher-finder.jsx';
import { Homepage, HomepageHeader } from './homepage/homepage.jsx';
import { Login } from './login/login.jsx';
import { Profile, ProfileHeader } from './profile/profile.jsx';
import { ProfileSetup, SetupHeader } from './profile/profile-setup.jsx';
import { useLoadGoogleMaps } from './components/loadGoogleMaps.jsx';

// Simple auth state enum
const AuthState = { Authenticated: true, NotAuthenticated: false };

export default function App() {

    const mapsLoaded = useLoadGoogleMaps(apiKeys.googleMapsApiKey);
    const [userName, setUserName] = React.useState(localStorage.getItem('username') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.NotAuthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    // if (!mapsLoaded) {
    //     return <div>Loading Google Maps...</div>;
    // }

    const checkAuth = React.useCallback(async () => {
        try {
            const res = await fetch('/api/user/me', {
                credentials: 'include',
            });
            setAuthState(res.ok);
        } catch (err) {
            console.error('Failed to check auth:', err);
            setAuthState(false);
        }
    }, []);

    React.useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <BrowserRouter>
            <div style={{ backgroundColor: '#ff6347', paddingTop:'1em' }}>
                <header className="container-fluid">
                    <NavbarContent isAuthed={authState} setIsAuthed={setAuthState} />
                    <HeaderContent />
                </header>

                <Routes>
                    <Route path="/" element={<Homepage />} exact />
                    <Route path="teacher-finder" element={<FindTeacher />} />
                    <Route path="events" element={<Events />} />
                        {/* TODO: Test profile/login related pages and see if I need to adjust the pages since I changed the cookies */}
                    <Route path="profile" element={<Profile />} /> 
                        {/* <Route path="create-post" element={<CreatePost />} /> */} {/*TODO: make post creation its own page?*/}
                    <Route path='login' element={<Login setIsAuthed={setAuthState} />} />
                    <Route path="profile-setup" element={<ProfileSetup />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

                <footer>
                    <div className="container-fluid">
                        <span className="text-reset">Dane Peterson</span>
                        <a className="text-reset" href="https://github.com/MmCrunchyLotion/startup">GitHub Repository</a>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}

function NavbarContent({ isAuthed, setIsAuthed }) {
    console.log('Navbar rendering, isAuthed:', isAuthed);
    const navigate = useNavigate();
    
    const handleLogoutClick = async () => {
        console.log('Starting logout flow...');
        try {
            const res = await fetch('/api/auth', {
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.ok) {
                console.log('Logout successful, setting isAuthed to false');
                setIsAuthed(false);
                navigate('/');
            }
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (    
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <div className="navbar-brand">Match your Music</div>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item"><NavLink className="nav-link text-dark" to="">Home</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link text-dark" to="teacher-finder">Find a teacher</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link text-dark" to="events">Events</NavLink></li>
                        {isAuthed === AuthState.Authenticated && (
                            <li className="nav-item"><NavLink className="nav-link text-dark" to="profile">Your Profile</NavLink></li>
                        )}
                        {/* TODO: Add a people tab? */}
                    </ul>
                    <div className="ms-auto">
                        {isAuthed === AuthState.Authenticated && (
                            <button onClick={handleLogoutClick} style={{backgroundColor: '#ff6347', border: 'none', cursor: 'pointer', color: '#000', textDecoration: 'none', padding: '0.5rem 1rem', display: 'block'}}>
                                Logout
                            </button>
                        )}
                        {isAuthed === AuthState.NotAuthenticated && (
                            <button onClick={() => navigate('/login')} style={{backgroundColor: '#ff6347', border: 'none', cursor: 'pointer', color: '#000', textDecoration: 'none', padding: '0.5rem 1rem', display: 'block'}}>
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

function HeaderContent() {
    const location = useLocation();

    const headers = {
        '/': { component: HomepageHeader },
        '/profile': { component: ProfileHeader },
        '/events': { component: EventsHeader },
        '/teacher-finder': { component: TeacherFinderHeader },
        '/login': { component: ProfileHeader },
        '/profile-setup': { component: SetupHeader }
    };

    // Use optional chaining to safely access the component. Falls back to HomepageHeader if not found.
    const HeaderComponent = (headers[location.pathname]?.component) || HomepageHeader;
    return <HeaderComponent />;
}

export function getCookie(cookieName) {

    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}
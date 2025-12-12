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
            <div style={{ backgroundColor: '#ff6347' }}>
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
        <nav className="navbar navbar-expand-lg bg-body-tertiary"> {/* TODO: Change jsx in this spot to the navbar appear regardless of window size */}
            <div className="container-fluid">
                <div className="navbar-brand" href="#"> {/* TODO: Link to homepage, Figure out why I left href # there */}
                    Match your Music
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <menu className="collapse navbar-collapse" id="navbarNav"> {/* TODO: Does this actually collapse? */}
                    <ul className="navbar-nav">
                        <li className="nav-item"><NavLink className="nav-link text-dark" to="">Home</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link text-dark" to="teacher-finder">Find a teacher</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link text-dark" to="events">Events</NavLink></li>
                        {/* TODO: Add a people tab? */}
                        {isAuthed === AuthState.Authenticated && (
                            <>
                                <li className="nav-item"><NavLink className="nav-link text-dark" to="profile">Your Profile</NavLink></li>
                                <li className="nav-item">
                                    <button onClick={handleLogoutClick} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#000', textDecoration: 'none'}}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                        {isAuthed === AuthState.NotAuthenticated && (
                            <li className="nav-item"><NavLink className="nav-link text-dark" to="login">Login</NavLink></li>
                        )}
                    </ul>
                </menu>
            </div>
            {/* <div className='container-fluid'> 
                {isAuthed ? (
                    <>
                        <span className="nav-item"><NavLink className="nav-link text-dark" to="profile">Your Profile</NavLink></span>
                        <span className="nav-item"><button onClick={handleLogoutClick} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#000', textDecoration: 'none'}}>Logout</button></span>
                    </>
                ) : (
                    <span className="nav-item"><NavLink className="nav-link text-dark" to="login">Login</NavLink></span>
                )}
            </div> */}
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
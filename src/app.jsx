import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Homepage, HomepageHeader } from './homepage/homepage';
import { Events, EventsHeader } from './events/events';
import { Profile, ProfileHeader } from './profile/profile';
import { FindTeacher, TeacherFinderHeader } from './teacher-finder/teacher-finder';
import { Login } from './login/login';
import { ProfileSetup, SetupHeader } from './profile/profile-setup.jsx';

export default function App() {
    const [isAuthed, setIsAuthed] = React.useState(false);

    const checkAuth = React.useCallback(async () => {
        try {
            const res = await fetch('/api/user/me', {
                credentials: 'include',
            });
            setIsAuthed(res.ok);
        } catch (err) {
            console.error('Failed to check auth:', err);
            setIsAuthed(false);
        }
    }, []);

    React.useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <BrowserRouter>
            <div style={{ backgroundColor: '#ff6347' }}>
                <header className="container-fluid">
                    <Navbar isAuthed={isAuthed} setIsAuthed={setIsAuthed} />
                    <ContentHeader />
                </header>

                <Routes>
                    <Route path="/" element={<Homepage />} exact />
                    <Route path="teacher-finder" element={<FindTeacher />} />
                    <Route path="events" element={<Events />} />
                    <Route path="profile" element={<Profile />} />
                    {/* <Route path="create-post" element={<CreatePost />} /> */}
                    <Route path='login' element={<Login setIsAuthed={setIsAuthed} />} />
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

function Navbar({ isAuthed, setIsAuthed }) {
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
                <div className="navbar-brand" href="#">Match your Music</div>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item"><NavLink className="nav-link text-dark" to="">Home</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link text-dark" to="teacher-finder">Find a teacher</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link text-dark" to="events">Events</NavLink></li>
                    {/* TODO: Add a people tab? */}
                    </ul>
                </div>
            </div>
            <div className='container-fluid'> 
                {isAuthed ? (
                    <>
                        <span className="nav-item"><NavLink className="nav-link text-dark" to="profile">Your Profile</NavLink></span>
                        <span className="nav-item"><button onClick={handleLogoutClick} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#000', textDecoration: 'none'}}>Logout</button></span>
                    </>
                ) : (
                    <span className="nav-item"><NavLink className="nav-link text-dark" to="login">Login</NavLink></span>
                )}
            </div>
        </nav>
    );
}

function ContentHeader() {
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
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Login, LoginHeader } from './login/login';
import { Events, EventsHeader } from './events/events';
import { Profile, ProfileHeader } from './profile/profile';
import { FindTeacher, TeacherFinderHeader } from './teacher-finder/teacher-finder';
import { CreatePost } from './create-post/create-post';



export default function App() {
    return (
        <BrowserRouter>
            <div style={{backgroundColor: '#ff6347'}}>
                <header className="container-fluid">
                    <nav className="navbar navbar-expand-lg bg-body-tertiary">
                        <div className="container-fluid">
                        <div className="navbar-brand" href="#">Match your Music</div>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item"><NavLink className="nav-link text-dark" to="">Login</NavLink></li>
                                    <li className="nav-item"><NavLink className="nav-link text-dark" to="teacher-finder">Find a teacher</NavLink></li>
                                    <li className="nav-item"><NavLink className="nav-link text-dark" to="events">Events</NavLink></li>
                                    <li className="nav-item"><NavLink className="nav-link text-dark" to="profile">Profile</NavLink></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <ContentHeader />
                </header>

                <Routes>
                    <Route path="/" element={<Login />} exact />
                    <Route path="teacher-finder" element={<FindTeacher />} />
                    <Route path="events" element={<Events />} />
                    <Route path="profile" element={<Profile />} />
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

function ContentHeader() {
    const location = useLocation();

    const headers = {
        '/': {
            function: LoginHeader
        },
        '/profile': {
            function: ProfileHeader
        },
        '/events': {
            function: EventsHeader
        },
        '/teacher-finder': {
            function: TeacherFinderHeader
        }
    };

    const HeaderComponent = headers[location.pathname].function || headers['/'].function;
    return <HeaderComponent />;
}

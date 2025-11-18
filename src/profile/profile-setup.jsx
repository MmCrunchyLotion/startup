import React from 'react';
import { ProfileEditForm } from '../components/ProfileEditForm.jsx';

function getCookie(cookieName) {
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

export function ProfileSetup() {
    const handleSubmit = (data) => {
        // TODO: replace with API call
        console.log('Submitted from shared form:', data);
    };

    const username = getCookie('username');

    return (
        <main className="container-fluid text-center">
            <h2>Profile Setup Page</h2>
            <ProfileEditForm initialData={{username: username}} onSubmit={handleSubmit}/>
        </main>);
}

export function SetupHeader() {
    return (
        <div className="container-fluid">
            <h1>Setup Your Profile</h1>
        </div>
    );
}
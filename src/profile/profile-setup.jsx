import React from 'react';
import { ProfileEditForm } from '../components/ProfileEditForm.jsx';

export function ProfileSetup() {
    const handleSubmit = (data) => {
        // TODO: replace with API call
        console.log('Submitted from shared form:', data);
        // setShowForm(false);
    };

    return (
        <main className="container-fluid text-center">
            <h2>Profile Setup Page</h2>
            <ProfileEditForm onSubmit={handleSubmit}/>
        </main>);
}

export function SetupHeader() {
    return (
        <div className="container-fluid">
            <h1>Setup Your Profile</h1>
        </div>
    );
}
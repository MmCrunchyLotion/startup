import React from 'react';
import { PersonSearchForm } from '../components/PersonSearchForm';
import { ProfileEditForm } from '../components/ProfileEditForm';

export function Profile() {
    const [showForm, setShowForm] = React.useState(false);

    const handleSubmit = (data) => {
        // TODO: replace with API call
        console.log('Submitted from shared form:', data);
        setShowForm(false);
    };

    return (
        <main className="container-fluid text-center">
            {/* <!-- need to implement a way to view other people's profiles, rather than just your own --> */}
            <div className="outer-profile">
                <h1>Your Profile</h1>
                <div className="inner-profile">
                    <div className="your-card">
                        <img src="https://pbs.twimg.com/profile_images/1011280580015804420/yQ21pTwo_400x400.jpg" className="img-thumbnail" alt="User Photo" />
                        <div className="profile-info">
                            <p className="username">Username: Jazzman123</p>
                            <p className="bio">Bio: Passionate about music and looking to connect with fellow musicians!</p>
                            <p className="account-type">Account Type: User</p>
                            <p className="location">Location: Provo, UT</p>
                        </div>
                        {!showForm ? (
                            <button
                                className="btn btn-primary text-dark"
                                type="button"
                                style={{ backgroundColor: '#ff6347' }}
                                onClick={() => setShowForm(true)}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <ProfileEditForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
                        )}
                    </div>
                </div>
            </div>
            <div className="outer-feed">
                <h2>Your Posts (database)</h2>
                <div className="inner-feed">
                    <div className="post">
                        <div className="post-info">
                            <p className="username">Jazzman123</p>
                            <p className="timestamp">3 hours ago</p>
                        </div>
                        <p className="post-content">Excited for the upcoming band showcase! Come watch me perform!</p>
                        <p className="event-link"><i>Local Band Showcase</i></p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export function ProfileHeader() {
    const [showForm, setShowForm] = React.useState(false);

    const handleSubmit = (data) => {
        // TODO: replace with API call
        console.log('Submitted from shared form:', data);
        setShowForm(false);
    };

    return (
        <div className="content-header">
            <h1>Find someone else!</h1>
            {!showForm ? (
                <button
                    className="btn btn-primary text-dark"
                    type="button"
                    style={{ backgroundColor: '#ff6347' }}
                    onClick={() => setShowForm(true)}
                >
                    Search
                </button>
            ) : (
                <PersonSearchForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
            )}
        </div>
    );
}
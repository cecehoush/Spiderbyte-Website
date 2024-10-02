import React from 'react';
import './Profile.css';
import catImage from '../../assets/cat.jpg'; // Adjust the path as needed

function Profile() {
    // This could be replaced with a state variable or prop in the future
    const username = "Cece Housh";

    const handleEditProfile = () => {
        // Add logic for editing profile here
        console.log("Edit profile clicked");
    };

    return (
        <div className="profile-container">
            <div className="stats-container">
                <div className="stat-box">
                    <h3>Completed Challenges:</h3>
                    <p>Easy: 15</p>
                    <p>Medium: 24</p>
                    <p>Hard: 69</p>
                </div>
                <div className="stat-box">
                    <h3>Completed Subjects:</h3>
                    <p>Total Completed: 4</p>
                    <p>Total Attempted: 20</p>
                </div>
                <div className="stat-box">
                    <h3>Completed Mock Interviews:</h3>
                    <p>Total Completed: 4</p>
                    <p>Total Attempted: 20</p>
                </div>
                <div className="stat-box">
                    <h3>Largest Streak:</h3>
                    <p className="large-number">20</p>
                </div>
            </div>
            <div className="user-info">
                <div className="profile-image-container">
                    <img src={catImage} alt="User profile" className="profile-picture" />
                    <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>
                </div>
                <h2 className="username">{username}</h2>
            </div>
        </div>
    );
}

export default Profile;
import React from 'react';
import './Profile.css';
import catImage from '../../assets/cat.jpg'; 

function Profile({ onLogout, username, streakData }) {
    const tags = ["arrays", "loops", "python", "robotics", "conditional statements", "recursion", "iteration", "sorting", "searching", "trees", "linked lists", "queues", "stacks", "heaps", "pointers"];

    const handleEditProfile = () => {
        console.log("Edit profile clicked");
    };

    const handleAddTag = () => {
        console.log("Add tag clicked");
    };

    const handleRemoveTag = (tag) => {
        console.log(`Remove tag clicked: ${tag}`);
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
            <div className="user-info-and-streak">
                <div className="user-info">
                    <div className="profile-image-container">
                        <img src={catImage} alt="User profile" className="profile-picture" />
                        <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>
                        <button className="logout-button" onClick={onLogout}>Logout</button>
                    </div>
                    <div className="username-and-tags">
                        <h2 className="username">{username}</h2>
                        <div className="tags-container">
                            <button className="add-tag-button" onClick={handleAddTag}>+</button>
                            {tags.map((tag, index) => (
                                <div key={index} className="tag">
                                    {tag}
                                    <button className="remove-tag-button" onClick={() => handleRemoveTag(tag)}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="streak-calendar">
                    <h3>Contribution Streak</h3>
                    <div className="streak-grid-container">
                        <div className="streak-grid">
                            {streakData.map((isActive, index) => (
                                <div 
                                    key={index} 
                                    className={`streak-day ${isActive ? 'active' : 'inactive'}`} 
                                    title={isActive ? "Active day" : "Inactive day"}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom-boxes-container">
                <div className="bottom-box recent-activity">
                    <h3 className="box-title">Recent Activity:</h3>
                    {/* Add content for Recent Activity here */}
                </div>
                <div className="bottom-box playlists">
                    <h3 className="box-title">Playlists:</h3>
                    <button className="add-playlist-button">+</button>
                    {/* Add content for Playlists here */}
                </div>
            </div>
        </div>
    );
}

export default Profile;
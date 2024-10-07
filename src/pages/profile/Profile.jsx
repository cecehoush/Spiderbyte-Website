import React from 'react';
import './Profile.css';
import catImage from '../../assets/cat.jpg'; 

function Profile() {
    const username = "Cece Housh";
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

     // Generate placeholder data for 3 weeks (active vs. inactive)
     const generateStreakData = () => {
        return Array(21).fill(0).map(() => Math.random() < 0.5);
    };

    const streakData = generateStreakData();

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
        </div>
    );
}

export default Profile;
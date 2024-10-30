import React, { useEffect, useState, useRef } from 'react';
import './Profile.css';
import catImage from '../../assets/cat.jpg';

function Profile({ onLogout, username, streakData }) {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [showTagOptions, setShowTagOptions] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Fetch challenges and aggregate tags from subject_tags and content_tags
        fetch('http://localhost:5000/api/challenges')
            .then((response) => response.json())
            .then((data) => {
                const uniqueTags = new Set();
                data.forEach((challenge) => {
                    challenge.subject_tags.forEach(tag => uniqueTags.add(tag));
                    challenge.content_tags.forEach(tag => uniqueTags.add(tag));
                });
                setTags([...uniqueTags]);
            })
            .catch((error) => console.error('Error fetching tags:', error));
    }, []);

    const handleAddTag = () => {
        setShowTagOptions(!showTagOptions);
    };

    const handleTagSelect = (tag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
            setTags(tags.filter((t) => t !== tag)); // Remove selected tag from options
        }
    };

    const handleRemoveTag = (tag) => {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
        setTags([...tags, tag]); // Add removed tag back to options
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowTagOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                        <button className="edit-profile-button" onClick={() => console.log("Edit profile clicked")}>Edit Profile</button>
                        <button className="logout-button" onClick={onLogout}>Logout</button>
                    </div>
                    <div className="username-and-tags">
                        <h2 className="username">{username}</h2>
                        <div className="tags-container1">
                            <button className="add-tag-button" onClick={handleAddTag}>+</button>
                            {showTagOptions && (
                                <div ref={dropdownRef} className="tag-dropdown">
                                    {tags.map((tag, index) => (
                                        <div key={index} onClick={() => handleTagSelect(tag)} className="dropdown-item">
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {selectedTags.map((tag, index) => (
                                <div key={index} className="tag1">
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

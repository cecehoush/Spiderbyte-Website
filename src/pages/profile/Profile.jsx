import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import catImage from '../../assets/cat.jpg';
import port from '../../port';
import { PlaylistCard } from '../../components/playlists/PlaylistCard';
import { CreatePlaylistModal } from '../../components/playlists/CreatePlaylistModal';
import '../../components/playlists/Playlists.css';

function Profile({ onLogout, username, streakData, userid }) {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [showTagOptions, setShowTagOptions] = useState(false);
    const [solvedChallenges, setSolvedChallenges] = useState([]);
    const [challengeCounts, setChallengeCounts] = useState({ easy: 0, medium: 0, hard: 0 });
    const [playlists, setPlaylists] = useState([]);
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const handleCreatePlaylist = (newPlaylist) => {
        setPlaylists([...playlists, newPlaylist]);
    };

    useEffect(() => {
        // Fetch challenges and aggregate tags from subject_tags and content_tags
        fetch(`http://localhost:${port}/api/challenges`, {
            credentials: 'include', // Include cookies with the request
        })
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

    useEffect(() => {
        // Fetch solved challenges
        fetch(`http://localhost:${port}/api/submissions/user/${userid}`, {
            credentials: 'include', // Include cookies with the request
        })
            .then((response) => response.json())
            .then((data) => {
                setSolvedChallenges(data);
                const counts = { easy: 0, medium: 0, hard: 0 };
                data.forEach((challenge) => {
                    if (challenge.valid_solution) {
                        if (challenge.challenge_difficulty >= 1 && challenge.challenge_difficulty <= 3) {
                            counts.easy++;
                        } else if (challenge.challenge_difficulty >= 4 && challenge.challenge_difficulty <= 7) {
                            counts.medium++;
                        } else if (challenge.challenge_difficulty >= 8 && challenge.challenge_difficulty <= 10) {
                            counts.hard++;
                        }
                    }
                });
                setChallengeCounts(counts);
            })
            .catch((error) => console.error('Error fetching solved challenges:', error));
    }, [userid]);

    useEffect(() => {
        console.log('Fetching playlists for userid:', userid);
        fetch(`http://localhost:${port}/api/playlists/${userid}`, {
            credentials: 'include'
        })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Raw playlist data:', data);
                // Check if data.playlists exists (in case API returns { playlists: [] })
                const playlistArray = Array.isArray(data) ? data : 
                                    (data.playlists ? data.playlists : []);
                console.log('Processed playlist array:', playlistArray);
                setPlaylists(playlistArray);
            })
            .catch(error => console.error('Error fetching playlists:', error));
    }, [userid]);

    // Add this to monitor playlists state changes
    useEffect(() => {
        console.log('Playlists state updated:', playlists);
    }, [playlists]);

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

    const handleChallengeClick = (challenge) => {
        fetch(`http://localhost:${port}/api/challenges/name/${challenge.challenge_name}`, {
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                // Remove the last line from the code before passing it
                const codeLines = challenge.code.split('\n');
                const codeWithoutLastLine = codeLines.slice(0, -1).join('\n');
                
                navigate(`/editor/${data._id}`, { 
                    state: { 
                        code: codeWithoutLastLine
                    } 
                });
            })
            .catch((error) => console.error('Error fetching challenge:', error));
    };

    return (
        <div className="profile-container">
            <div className="stats-container">
                <div className="stat-box">
                    <h3>Completed Challenges:</h3>
                    <p>Easy: {challengeCounts.easy}</p>
                    <p>Medium: {challengeCounts.medium}</p>
                    <p>Hard: {challengeCounts.hard}</p>
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
                <div className="bottom-box solved-challenges">
                    <h3 className="box-title">Solved Challenges:</h3>
                    <ul>
                        {solvedChallenges.filter(challenge => challenge.valid_solution).map((challenge, index) => (
                            <li key={index} onClick={() => handleChallengeClick(challenge)}>
                                <p>Challenge: {challenge.challenge_name}</p>
                                <p>Execution Time: {challenge.execution_time_ms}ms</p>
                                <p>Date: {new Date(challenge.submitted_at).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bottom-box playlists">
                    <h3 className="box-title">Playlists:</h3>
                    <button 
                        className="add-playlist-button" 
                        onClick={() => setShowCreatePlaylist(true)}
                    >
                        +
                    </button>
                    <div className="playlists-container">
                        {Array.isArray(playlists) && playlists.length > 0 ? (
                            playlists.map(playlist => {
                                console.log('Rendering playlist in profile:', playlist);
                                return (
                                    <PlaylistCard 
                                        key={playlist._id}
                                        playlist={{
                                            id: playlist._id,
                                            name: playlist.name,  // Change title to name
                                            description: playlist.description,
                                            challengeCount: playlist.challenges?.length || 0
                                        }} 
                                    />
                                );
                            })
                        ) : (
                            <p style={{ color: '#FFFFFF', textAlign: 'center', marginTop: '60px' }}>
                                No playlists found. Create one by clicking the + button!
                            </p>
                        )}
                    </div>
                    {showCreatePlaylist && (
                        <CreatePlaylistModal
                            onClose={() => setShowCreatePlaylist(false)}
                            onCreatePlaylist={handleCreatePlaylist}
                            userid={userid}  // Add this line
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import port from '../../port';
import './Playlists.css';

export function PlaylistView() {
    const { name } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [allChallenges, setAllChallenges] = useState([]);
    const [playlistChallenges, setPlaylistChallenges] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChallenges, setSelectedChallenges] = useState([]);

    useEffect(() => {
        if (!name) {
            console.log('No playlist name provided');
            return;
        }

        const decodedName = decodeURIComponent(name);
        console.log('Attempting to fetch playlist:', decodedName);
        
        fetch(`http://localhost:${port}/api/playlists/playlist/${decodedName}`, {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Successfully fetched playlist:', data);
                const playlistData = data.playlist || data;
                console.log('Processed playlist data:', playlistData);
                setPlaylist(playlistData);
                console.log('PLAYLIST CHALLENGES:', playlistData.challenges);
                return playlistData.challenges || [];
            })
            .then(challengeIds => {
                if (challengeIds.length > 0) {
                    console.log('Fetching challenges by IDs:', challengeIds);
                    
                    return fetch(`http://localhost:${port}/api/challenges/by-ids`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ challengeIds: challengeIds })  // Wrap IDs in challengeIds property
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch challenges');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Fetched playlist challenges:', data);
                        setPlaylistChallenges(Array.isArray(data) ? data : []);  // Ensure we handle the response as an array
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching playlist:', error);
                console.error('Playlist name was:', decodedName);
            });
    }, [name]);

    useEffect(() => {
      fetch(`http://localhost:${port}/api/challenges`, {
          credentials: 'include'
      })
          .then(response => response.json())
          .then(data => {
              console.log('Received challenges:', data);
              const challenges = data.challenges || data;
              setAllChallenges(challenges);
          })
          .catch(error => {
              console.error('Error fetching challenges:', error);
          });
  }, []);

    const handleChallengeSelect = (challenge) => {
        setSelectedChallenges(prev => {
            const isSelected = prev.some(c => c._id === challenge._id);
            if (isSelected) {
                return prev.filter(c => c._id !== challenge._id);
            } else {
                return [...prev, challenge];
            }
        });
    };

    const handleAddChallenges = async () => {
        if (selectedChallenges.length === 0) {
            return;
        }

        const challengeIds = selectedChallenges.map(c => c._id);
        console.log('Submitting challenge IDs:', challengeIds);

        try {
            const response = await fetch(`http://localhost:${port}/api/playlists/add-challenge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    playlistId: playlist._id,
                    challengeIds: challengeIds
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add challenges');
            }

            const data = await response.json();
            setPlaylist(data.playlist);
            setSelectedChallenges([]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding challenges:', error);
        }
    };

    const handleChallengeClick = (challengeId) => {
        navigate(`/editor/${challengeId}`);
    };

    return (
        <div className="playlist-view">
            <div className="playlist-view-container">
                <div className="playlist-header">
                    <h2>{playlist ? playlist.name : 'Loading...'}</h2>
                    <p className="playlist-description">{playlist?.description}</p>
                </div>
                <div className="challenges-box">
                    <h3 className="box-title">Challenges</h3>
                    <button className="add-challenge-button" onClick={() => setIsModalOpen(true)}>+</button>
                    <ul>
                        {playlistChallenges.map((challenge, index) => (
                            <li key={index} onClick={() => handleChallengeClick(challenge._id)}>
                                <p>Challenge: {challenge.challenge_title}</p>
                                <p>{challenge.challenge_description.description}</p>
                                <p>Difficulty: {challenge.challenge_difficulty}/10</p>
                            </li>
                        ))}
                        {playlistChallenges.length === 0 && (
                            <p className="no-challenges">No challenges added yet</p>
                        )}
                    </ul>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content challenge-select-modal">
                        <h3>Select Challenge{selectedChallenges.length ? ` (${selectedChallenges.length} selected)` : 's'}</h3>
                        <div className="challenges-list">
                            {allChallenges.map((challenge) => (
                                <div 
                                    key={challenge._id} 
                                    className={`challenge-select-item ${
                                        selectedChallenges.some(c => c._id === challenge._id) ? 'selected' : ''
                                    }`}
                                    onClick={() => handleChallengeSelect(challenge)}
                                >
                                    <h4>{challenge.challenge_title || 'Untitled Challenge'}</h4>
                                    <p>
                                        {challenge.challenge_description.description 
                                            ? (challenge.challenge_description.description.length > 100 
                                                ? `${challenge.challenge_description.description.substring(0, 100)}...` 
                                                : challenge.challenge_description.description)
                                            : 'No description available'}
                                    </p>
                                    <div className="tags">
                                        {(challenge.tags || []).map((tag, index) => (
                                            <span key={index} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="modal-buttons">
                            <button 
                                className="submit-button" 
                                onClick={handleAddChallenges}
                                disabled={selectedChallenges.length === 0}
                            >
                                Add {selectedChallenges.length} Challenge{selectedChallenges.length !== 1 ? 's' : ''}
                            </button>
                            <button className="cancel-button" onClick={() => {
                                setSelectedChallenges([]);
                                setIsModalOpen(false);
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
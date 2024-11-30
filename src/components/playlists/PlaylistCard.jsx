import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Playlists.css';

export function PlaylistCard({ playlist }) {
    const navigate = useNavigate();

    const handleClick = () => {
        // Use name instead of title to match the database field
        console.log('Clicking playlist:', playlist);
        const encodedName = encodeURIComponent(playlist.name || playlist.title);
        console.log('Navigating to:', `/playlist/${encodedName}`);
        navigate(`/playlist/${encodedName}`);
    };

    return (
        <div className="playlist-card" onClick={handleClick}>
            <h3 className="playlist-title">{playlist.name || playlist.title}</h3>
            <p className="playlist-description">{playlist.description}</p>
            <p className="challenge-count">Challenges: {playlist.challengeCount}</p>
        </div>
    );
}
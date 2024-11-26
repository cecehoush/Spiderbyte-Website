import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Playlists.css';

export const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <div className="playlist-card" onClick={handleClick}>
      <h4 className="playlist-title">{playlist.title}</h4>
      <p className="playlist-description">{playlist.description}</p>
      <p className="challenge-count">
        {playlist.challenges?.length || 0} challenges
      </p>
    </div>
  );
};
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Playlists.css';

export const PlaylistView = ({ playlists }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  return (
    <div className="playlist-view">
      <div className="playlist-header">
        <h2>{playlist.title}</h2>
        <p>{playlist.description}</p>
      </div>
      <div className="playlist-challenges">
        {playlist.challenges?.length > 0 ? (
          playlist.challenges.map(challenge => (
            <div key={challenge.id} className="challenge-item">
              <h4>{challenge.title}</h4>
              <p>{challenge.description}</p>
            </div>
          ))
        ) : (
          <div className="empty-playlist">
            <p>No challenges added yet</p>
            <button className="add-challenges-button">Add Challenges</button>
          </div>
        )}
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        Back to Profile
      </button>
    </div>
  );
};
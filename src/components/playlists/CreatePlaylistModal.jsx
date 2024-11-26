import React, { useState } from 'react';
import './Playlists.css';

export const CreatePlaylistModal = ({ onClose, onCreatePlaylist }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreatePlaylist({ title, description, challenges: [] });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Playlist</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="submit-button">Create</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

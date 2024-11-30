import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import port from '../../port';

export function CreatePlaylistModal({ onClose, onCreatePlaylist, userid }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_public: true,
        created_by: userid  // Make sure this is set
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          console.log(userid);
            const response = await fetch(`http://localhost:${port}/api/playlists/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    is_public: formData.is_public,
                    created_by: userid  // Make sure to include this
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create playlist');
            }

            const newPlaylist = await response.json();
            onCreatePlaylist(newPlaylist);
            onClose();
            navigate(`/playlist/${newPlaylist.playlist.name}`);
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Create New Playlist</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.is_public}
                                onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                            />
                            Make playlist public
                        </label>
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="submit-button">Create</button>
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

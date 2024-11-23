import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';

function LoginSignup({ onLogin, onSignup }) {
    const location = useLocation();
    const isLogin = location.pathname === '/login';
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const response = await axios.post('http://localhost:5000/api/users/signin', { username, password });
                onLogin(response.data);
            } else {
                const response = await axios.post('http://localhost:5000/api/users/signup', { username, password });
                onSignup(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="auth-page-container">
            <div className="login-signup-container">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-button">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <p>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <Link to={isLogin ? '/signup' : '/login'} className="switch-auth-mode">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginSignup;
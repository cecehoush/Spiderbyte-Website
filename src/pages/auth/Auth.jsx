import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Auth.css';

function LoginSignup({ onLogin, onSignup }) {
    const location = useLocation();
    const isLogin = location.pathname === '/login';
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(username, password);
        } else {
            onSignup(username, password);
        }
    };

    return (
        <div className="login-signup-container">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
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
    );
}

export default LoginSignup;
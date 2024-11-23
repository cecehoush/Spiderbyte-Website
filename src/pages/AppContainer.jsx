import React, { useState } from 'react';
import Profile from './Profile';
import LoginSignup from './LoginSignup';

function AppContainer() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div>
            {isLoggedIn ? (
                <Profile onLogout={handleLogout} />
            ) : (
                <LoginSignup onLogin={handleLogin} />
            )}
        </div>
    );
}

export default AppContainer;
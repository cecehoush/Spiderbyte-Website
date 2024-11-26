import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

export default function ChallengeCard({ challenge }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Link 
            to={`/editor/${challenge._id}`} 
            className={`challenge-card-link ${isMobile ? 'mobile' : ''}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
        >
            <div className="challenge-card">
                <div className="challenge-card-title">
                    <h1>{challenge.challenge_title}</h1>
                </div>
            </div>
        </Link>
    );
}
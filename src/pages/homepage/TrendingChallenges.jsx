import React, { useState, useEffect } from "react";
import "./Homepage.css";
import ChallengeCard from "./TrendingChallengeCard";

export default function TrendingChallenges({challenges}) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return(
        <div className={`trending-challenges ${isMobile ? 'mobile' : ''}`}>
            <div className="trending-challenges-title">
                <h1>🔥 Trending Challenges 🔥</h1>
            </div>
            <div className={`challenges-grid ${isMobile ? 'mobile' : ''}`}>
                {challenges.map((challenge) => (
                    <ChallengeCard challenge={challenge} key={challenge.id}></ChallengeCard>
                ))}
            </div>
        </div>
    );
}
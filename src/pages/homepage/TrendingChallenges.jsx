import React from "react";
import "./Homepage.css";
import ChallengeCard from "./TrendingChallengeCard";

export default function Trendingchallenge({challenges}) {
    return(
        <div className="trending-challenges">
            <div className="trending-challenges-title">
                <h1>🔥 Trending Challenges 🔥</h1>
            </div>
            <div className="challenges-grid">
                {challenges.map((challenge) => (
                    <ChallengeCard challenge={challenge} key={challenge.id}></ChallengeCard>
                ))}
        </div>
        </div>
    );
}
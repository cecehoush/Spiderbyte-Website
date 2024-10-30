import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

export default function ChallengeCard({ challenge }) {
    return (
        <Link 
            to={`/editor/${challenge._id}`} 
            className="challenge-card-link"
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
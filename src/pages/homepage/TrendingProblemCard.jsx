import React from "react";
import "./Homepage.css";

export default function ProblemCard({problem}) {
    return (
        <a href={`/problems/${problem.id}`} className=".problem-card-link">
        <div className="problem-card">
            <div className="problem-card-title">
                <h1>{problem.name}</h1>
            </div>
        </div>
        </a>
    );
}
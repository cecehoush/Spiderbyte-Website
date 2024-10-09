import React from "react";
import "./Homepage.css";
import ProblemCard from "./TrendingProblemCard";

export default function TrendingProblems({problems}) {
    return(
        <div className="trending-problems">
            <div className="trending-problems-title">
                <h1>🔥 Trending Problems 🔥</h1>
            </div>
            <div className="problems-grid">
                {problems.map((problem) => (
                    <ProblemCard problem={problem} key={problem.id}></ProblemCard>
                ))}
        </div>
        </div>
    );
}
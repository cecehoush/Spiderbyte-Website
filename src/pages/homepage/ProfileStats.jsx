import React, { useState, useEffect } from "react";
import "./Homepage.css";
export default function ProfileStats({ isLoggedIn, username, streakData }) {

  const challengeSolved = 18;
  const longestStreak = 5;
  const linesOfCode = 432;

  if (isLoggedIn === false) {
    return (
      <div className="profile-stats">
      <div className="profile-stats-title">
        <h1>Login to view stats!</h1>
      </div>
      <div className="profile-stats-content">
        <button className="profile-stats-button" onClick={() => window.location.href = '/login'}>Login</button>
        <button className="profile-stats-button" onClick={() => window.location.href = '/signup'}>Sign Up</button>
      </div>
      </div>
    );
  } else {
    return (
      <div className="profile-stats">
        <div className="profile-stats-title">
          <h1>{username}</h1>
        </div>
        <div className="profile-description-wrapper">
          <p className="profile-description">
            <span className="variable-color">{challengeSolved}</span> Challenges
            Solved
            <br />
            Longest Streak:{" "}
            <span className="variable-color">{longestStreak}</span>
            <br />
            <span className="variable-color">{linesOfCode}</span> Lines of Code
            Written
          </p>
          <div className="profile-stats-streak">7🔥</div>
        </div>
        <div className="streak-grid-container-homepage">
          <div className="streak-grid">
            {streakData.map((isActive, index) => (
              <div
                key={index}
                className={`streak-day ${isActive ? "active" : "inactive"}`}
                title={isActive ? "Active day" : "Inactive day"}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

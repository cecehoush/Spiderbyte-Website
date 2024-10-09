import React from "react";
import "./Homepage.css";

export default function SubjectCard({ subject }) {
  return (
    <a href={`/subject/${subject.id}`} className="subject-card-link">
      <div className="subject-card">
        <div className="subject-card-title">
          <h3>{subject.name}</h3>
        </div>
        <div className="subject-card-description">
          <p>{subject.description}</p>
        </div>
        <img
          className="subject-card-image"
          src={subject.image}
          alt={subject.name}
        />
      </div>
    </a>
  );
}

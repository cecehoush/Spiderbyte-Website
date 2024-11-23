import React from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";


export default function SubjectCard({ subject }) {

  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to the subject page and pass subject name as state
    navigate(`/subjects`, { state: { subjectName: subject.name } });
  };

  return (
    <div className="subject-card-link" onClick={handleCardClick}>
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
    </div>
  );
}

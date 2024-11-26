import React, { useState, useEffect } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

export default function SubjectCard({ subject }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = () => {
    navigate(`/subjects`, { state: { subjectName: subject.name } });
  };

  return (
    <div 
      className={`subject-card-link ${isMobile ? 'mobile' : ''}`} 
      onClick={handleCardClick}
    >
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
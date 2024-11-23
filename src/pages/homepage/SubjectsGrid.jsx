import React from "react";
import SubjectCard from "./SubjectCard";
import './Homepage.css';

export default function SubjectsGrid({subjects}) {

    const leftColumnSubjects = subjects.filter((_, index) => index % 2 === 0);
    const rightColumnSubjects = subjects.filter((_, index) => index % 2 !== 0);

    return (
        <div className="subjects-grid-container">
            <div className="subjects-column">
                {leftColumnSubjects.map((subject) => (
                    <div key={subject.id} className="subject-wrapper">
                        <SubjectCard subject={subject} />
                    </div>
                ))}
            </div>
            <div className="subjects-column">
                {rightColumnSubjects.map((subject) => (
                    <div key={subject.id} className="subject-wrapper">
                        <SubjectCard subject={subject} />
                    </div>
                ))}
            </div>
        </div>
    );
}
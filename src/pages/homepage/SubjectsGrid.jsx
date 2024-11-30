import React, { useState, useEffect } from "react";
import SubjectCard from "./SubjectCard";
import './Homepage.css';

export default function SubjectsGrid({subjects}) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [gridLayout, setGridLayout] = useState({
        leftColumnSubjects: [],
        rightColumnSubjects: []
    });

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            if (mobile) {
                // Single column layout for mobile
                setGridLayout({
                    leftColumnSubjects: subjects,
                    rightColumnSubjects: []
                });
            } else {
                // Two-column layout for desktop
                setGridLayout({
                    leftColumnSubjects: subjects.filter((_, index) => index % 2 === 0),
                    rightColumnSubjects: subjects.filter((_, index) => index % 2 !== 0)
                });
            }
        };

        // Initial setup
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [subjects]);

    return (
        <div className={`subjects-grid-container ${isMobile ? 'mobile' : ''}`}>
            <div className="subjects-column">
                {gridLayout.leftColumnSubjects.map((subject) => (
                    <div key={subject.id} className="subject-wrapper">
                        <SubjectCard subject={subject} />
                    </div>
                ))}
            </div>
            {!isMobile && (
                <div className="subjects-column">
                    {gridLayout.rightColumnSubjects.map((subject) => (
                        <div key={subject.id} className="subject-wrapper">
                            <SubjectCard subject={subject} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
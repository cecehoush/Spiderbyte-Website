import React, { useState, useEffect } from 'react';
import './Subjects.css';
import subjectsData from './subjectsData.json';
import challengesData from './challengesData.json';
import tagsData from './tagsData.json';

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); 
    const itemsPerPage = 10; 
    const subjectsPerPage = 4; 

    useEffect(() => {
        setSubjects(subjectsData);
    }, []);

    const handleNext = () => {
        if (startIndex + subjectsPerPage < subjects.length) {
            setStartIndex(startIndex + subjectsPerPage);
        }
    };

    const handlePrev = () => {
        if (startIndex - subjectsPerPage >= 0) {
            setStartIndex(startIndex - subjectsPerPage);
        }
    };

    const handleNextChallenges = () => {
        if ((currentPage + 1) * itemsPerPage < challengesData.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevChallenges = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const currentChallenges = challengesData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div>
            <div className='subjects-container'>
                <div className='subjects-box'>
                    <div className='subjects-label'>Subjects:</div>
                    <div className='subjects-carousel'>
                        <button className='arrow left' onClick={handlePrev} disabled={startIndex === 0}>
                            &#10094;
                        </button>
                        <div className='subjects-display'>
                            {subjects.slice(startIndex, startIndex + subjectsPerPage).map((subject) => (

                                <div key={subject.id} className='subject-item'>
                                    <h3>{subject.name}</h3>
                                    <p>{subject.description}</p>
                                    <img src={subject.image} alt={subject.name} />
                                </div>
                            ))}
                        </div>
                        <button className='arrow right' onClick={handleNext} disabled={startIndex + subjectsPerPage >= subjects.length}>
                            &#10095;
                        </button>
                    </div>
                </div>
            </div>

            <div className="bottom-container">
                <div className="challenges-container">
                    <div className="challenges-label">Challenges:</div>
                    <div className="challenges-header">
                        <div className="header-item">Daily</div>
                        <div className="header-item">Name</div>
                        <div className="header-item">User Attempts</div>
                        <div className="header-item">User Solved</div>
                        <div className="header-item">Solved</div>
                        <div className="header-item">Solution</div>
                    </div>

                    <div className="challenges-list">
                        {currentChallenges.map((challenge) => (
                            <div key={challenge.question_id} className="challenge-row">
                                <div className="challenge-item">{challenge.daily ? "Yes" : "No"}</div>
                                <div className="challenge-item">{challenge.question_name}</div>
                                <div className="challenge-item">{challenge.user_attempts}</div>
                                <div className="challenge-item">{challenge.user_submissions}</div>
                                <div className="challenge-item">{challenge.solved ? "Yes" : "No"}</div>
                                <div className="challenge-item">
                                    <button>View Solution</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="challenges-pagination">
                        <button onClick={handlePrevChallenges} disabled={currentPage === 0}>
                            &#10094;
                        </button>
                        <button onClick={handleNextChallenges} disabled={(currentPage + 1) * itemsPerPage >= challengesData.length}>
                            &#10095;
                        </button>
                    </div>
                </div>

                <div className="tags-container">
                    <div className="tags-label">Tags:</div>
                    <div className="tags-grid">
                        {tagsData.tags.map((tag) => (
                            <div key={tag.id} className="tag-item">
                                {tag.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Subjects;


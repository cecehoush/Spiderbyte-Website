import React, { useState, useEffect, useRef } from 'react';
import './Subjects.css';
import subjectsData from './subjectsData.json';
import challengesData from './challengesData.json';
import tagsDataJson from './tagsData.json';

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(0);
    const scrollContainerRef = useRef(null);
    const itemsPerPage = 10;
    const scrollAmount = 360; // Width of item (340px) + gap (20px)

    useEffect(() => {
        setSubjects(subjectsData);
        setTags(tagsDataJson.tags.map(tag => ({
            ...tag,
            isSelected: false
        })));
    }, []);

    const handleNext = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft += scrollAmount;
        }
    };

    const handlePrev = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= scrollAmount;
        }
    };

    const canScrollLeft = () => {
        return scrollContainerRef.current && scrollContainerRef.current.scrollLeft > 0;
    };

    const canScrollRight = () => {
        if (!scrollContainerRef.current) return false;
        const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
        return scrollLeft + clientWidth < scrollWidth;
    };

    useEffect(() => {
        setSubjects(subjectsData);
        setTags(tagsDataJson.tags.map(tag => ({
            ...tag,
            isSelected: false
        })));
    }, []);

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

    const handleTagToggle = (tagName) => {
        setSelectedTags(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(tagName)) {
                newSelected.delete(tagName);
            } else {
                newSelected.add(tagName);
            }
            return newSelected;
        });
    };

    return (
        <div>
            <div className='subjects-container'>
                <div className='subjects-box'>
                    <div className='subjects-label'>Subjects:</div>
                    <div className='subjects-carousel'>
                        <button 
                            className='arrow left' 
                            onClick={handlePrev} 
                            disabled={!canScrollLeft()}
                        >
                            &#10094;
                        </button>
                        <div 
                            className='subjects-display'
                            ref={scrollContainerRef}
                        >
                            {subjects.map((subject) => (
                                <div key={subject.id} className='subject-item'>
                                    <h3>{subject.name}</h3>
                                    <p>{subject.description}</p>
                                    <img src={subject.image} alt={subject.name} />
                                </div>
                            ))}
                        </div>
                        <button 
                            className='arrow right' 
                            onClick={handleNext}
                            disabled={!canScrollRight()}
                        >
                            &#10095;
                        </button>
                    </div>
                </div>
            </div>

            <div className="bottom-container">
                {/* Challenges Section */}
                <div className="challenges-container">
                    <div className="challenges-label">Challenges:</div>
                    <div className="challenges-content">
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
                </div>

                {/* Tags Section */}
                <div className="tags-container">
                    <div className="tags-label">Tags:</div>
                    <div className="tags-grid">
                        {tags.map((tag, index) => (
                            <label key={index} className="tag">
                                <input
                                    type="checkbox"
                                    checked={selectedTags.has(tag.name)}
                                    onChange={() => handleTagToggle(tag.name)}
                                    className="tag-checkbox"
                                />
                                <span className="tag-name">{tag.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Subjects;
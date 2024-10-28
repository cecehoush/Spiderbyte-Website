import React, { useState, useEffect, useRef } from 'react';
import './Subjects.css';
import { Link } from 'react-router-dom';

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [filteredChallenges, setFilteredChallenges] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(new Set());
    const [selectedSubjectName, setSelectedSubjectName] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const scrollContainerRef = useRef(null);
    const itemsPerPage = 10;
    const scrollAmount = 360;

    useEffect(() => {
        // Fetch all subjects
        fetch('http://localhost:5000/api/subjects')
            .then((response) => response.json())
            .then((data) => setSubjects(data))
            .catch((error) => console.error('Error fetching subjects:', error));
    }, []);

    // Function to handle subject selection and fetch associated challenges
    const handleSubjectClick = (subjectName) => {
        setSelectedSubjectName(subjectName);
        setCurrentPage(0); // Reset pagination to the first page

        // Fetch challenges related to the selected subject by name
        fetch(`http://localhost:5000/api/subjects/name/${subjectName}/problems`)
            .then((response) => response.json())
            .then((data) => {
                setChallenges(data);
                setFilteredChallenges(data); // Initially set to all challenges

                // Aggregate unique tags from subject_tags and content_tags
                const uniqueTags = new Set();
                data.forEach((challenge) => {
                    challenge.subject_tags.forEach(tag => uniqueTags.add(tag));
                    challenge.content_tags.forEach(tag => uniqueTags.add(tag));
                });

                // Convert Set to array and set it as tags for rendering
                setTags([...uniqueTags]);
            })
            .catch((error) => console.error('Error fetching challenges:', error));
    };

    // Filter challenges by selected tags
    const filterChallengesByTags = (challengesList, selectedTags) => {
        if (selectedTags.size === 0) return challengesList;
        return challengesList.filter((challenge) =>
            [...selectedTags].some(tag => 
                challenge.subject_tags.includes(tag) || 
                challenge.content_tags.includes(tag)
            )
        );
    };

    // Handle tag selection toggle and update filtered challenges
    const handleTagToggle = (tagName) => {
        setSelectedTags((prev) => {
            const newSelectedTags = new Set(prev);
            if (newSelectedTags.has(tagName)) {
                newSelectedTags.delete(tagName);
            } else {
                newSelectedTags.add(tagName);
            }
            
            // Filter challenges based on updated selected tags
            setFilteredChallenges(filterChallengesByTags(challenges, newSelectedTags));
            return newSelectedTags;
        });
    };

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

    const canScrollLeft = () => scrollContainerRef.current && scrollContainerRef.current.scrollLeft > 0;

    const canScrollRight = () => {
        if (!scrollContainerRef.current) return false;
        const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
        return scrollLeft + clientWidth < scrollWidth;
    };

    const handleNextChallenges = () => {
        if ((currentPage + 1) * itemsPerPage < filteredChallenges.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevChallenges = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const currentChallenges = filteredChallenges.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

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
                                <div 
                                    key={subject.name} 
                                    className={`subject-item ${selectedSubjectName === subject.name ? 'selected' : ''}`}
                                    onClick={() => handleSubjectClick(subject.name)} 
                                >
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
                                <Link
                                    to={`/editor/${challenge._id}`} 
                                    key={challenge._id}
                                    className="challenge-row"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div className="challenge-item">{challenge.daily_question ? "Yes" : "No"}</div>
                                    <div className="challenge-item">{challenge.challenge_title}</div>
                                    <div className="challenge-item">{challenge.users_attempted}</div>
                                    <div className="challenge-item">{challenge.users_solved}</div>
                                    <div className="challenge-item">{challenge.solved ? "Yes" : "No"}</div>
                                    <div className="challenge-item">
                                        <button>View Solution</button>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="challenges-pagination">
                            <button onClick={handlePrevChallenges} disabled={currentPage === 0}>
                                &#10094;
                            </button>
                            <button onClick={handleNextChallenges} disabled={(currentPage + 1) * itemsPerPage >= filteredChallenges.length}>
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
                                    checked={selectedTags.has(tag)}
                                    onChange={() => handleTagToggle(tag)}
                                    className="tag-checkbox"
                                />
                                <span className="tag-name">{tag}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Subjects;
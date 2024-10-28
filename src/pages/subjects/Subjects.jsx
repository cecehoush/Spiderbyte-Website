import React, { useState, useEffect, useRef } from 'react';
import './Subjects.css';
import { Link } from 'react-router-dom';

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(new Set());
    const [selectedSubjectName, setSelectedSubjectName] = useState(null); // Use `name` instead of `id`
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

        // Fetch all tags (if needed)
        fetch('http://localhost:5000/api/tags')
            .then((response) => response.json())
            .then((data) => {
                setTags(data.tags.map(tag => ({
                    ...tag,
                    isSelected: false
                })));
            })
            .catch((error) => console.error('Error fetching tags:', error));
    }, []);

    // Function to handle subject selection and fetch associated challenges
    const handleSubjectClick = (subjectName) => {
        setSelectedSubjectName(subjectName); // Set selected subject name
        setCurrentPage(0); // Reset pagination to the first page

        // Fetch challenges related to the selected subject by name
        fetch(`http://localhost:5000/api/subjects/name/${subjectName}/problems`)
            .then((response) => response.json())
            .then((data) => setChallenges(data))
            .catch((error) => console.error('Error fetching challenges:', error));
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
        if ((currentPage + 1) * itemsPerPage < challenges.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevChallenges = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const currentChallenges = challenges.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const handleTagToggle = (tagName) => {
        setSelectedTags((prev) => {
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
                                <div 
                                    key={subject.name} 
                                    className={`subject-item ${selectedSubjectName === subject.name ? 'selected' : ''}`}
                                    onClick={() => handleSubjectClick(subject.name)} // Call handleSubjectClick with name
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
                to={`/editor/${challenge._id}`} // Route to the CodeEditorPage with challengeId
                key={challenge._id}
                className="challenge-row"
                style={{ textDecoration: 'none', color: 'inherit' }} // Style to remove default link appearance
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
            <button onClick={handleNextChallenges} disabled={(currentPage + 1) * itemsPerPage >= challenges.length}>
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

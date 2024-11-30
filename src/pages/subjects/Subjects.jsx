import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./Subjects.css";
import { Link } from "react-router-dom";
import { X, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import  port  from "../../port";

function Subjects() {
  const location = useLocation();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [selectedSubjectName, setSelectedSubjectName] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [subjectTags, setSubjectTags] = useState([]);
  const [contentTags, setContentTags] = useState([]);
  const [selectedSubjectTags, setSelectedSubjectTags] = useState([]);
  const [selectedContentTags, setSelectedContentTags] = useState([]);
  const [difficulty, setDifficulty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const itemsPerPage = 10;
  const scrollAmount = 360;

  useEffect(() => {
    // Fetch all subjects initially
    fetch(`http://localhost:${port}/api/subjects`, {
      credentials: "include", // Include cookies with the request
    })
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  useEffect(() => {
    // Check if state has subjectName and set it as selectedSubjectName
    const subjectNameFromState = location.state?.subjectName;
    if (subjectNameFromState) {
      handleSubjectClick(subjectNameFromState);
    }
  }, [location.state]);

  const togglePopup = async () => {
    setIsPopupOpen(true);
    setIsLoading(true); // Show loader immediately
    if (!isPopupOpen) {
      try {
        const response = await fetch(`http://localhost:${port}/api/subjects`); // Use the proxy
        const data = await response.json();
        const subjectNames = data.map((subject) => subject.name);
        setSubjectTags(subjectNames);
        const tagResponse = await fetch(`http://localhost:${port}/api/tags`);
        const tagData = await tagResponse.json();
        const tagNames = tagData.map((tag) => tag.name);
        setContentTags(tagNames);
      } catch (error) {
        console.error("Error fetching Subject or Content tags:", error);
      } finally {
        setIsLoading(false); // Hide loader after data is fetched
      }
    } else {
      setIsPopupOpen(false);
    }
  };

  const handleSearch = (
    difficulty,
    selectedContentTags,
    selectedSubjectTags
  ) => {
    setIsLoading(true);

    fetch(`http://localhost:${port}/api/challenges/getquestion`, {
      method: "POST", // Use POST if you're sending a body; GET doesn't support a body in HTTP
      credentials: "include", // Include cookies with the request
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        difficulty,
        content_tags: selectedContentTags,
        subject_tags: selectedSubjectTags,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract the challengeID from the response
        const challengeID = data.challengeID; // Adjust key based on your API response structure
        if (challengeID) {
          // Navigate to the editor route with the challengeID
          navigate(`/editor/${challengeID}`);
        } else {
          console.error("Challenge ID not found in the response.");
        }
      })
      .catch((error) => {
        console.error("Error fetching challenge:", error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsPopupOpen(false);
      });
  };

  // Function to handle subject selection and fetch associated challenges
  const handleSubjectClick = (subjectName) => {
    setSelectedSubjectName(subjectName);
    setCurrentPage(0);

    fetch(`http://localhost:${port}/api/subjects/name/${subjectName}/challenges`, {
      credentials: "include", // Include cookies with the request
    })
      .then((response) => response.json())
      .then((data) => {
        setChallenges(data);
        setFilteredChallenges(data);

        const uniqueTags = new Set();
        data.forEach((challenge) => {
          challenge.subject_tags.forEach((tag) => uniqueTags.add(tag));
          challenge.content_tags.forEach((tag) => uniqueTags.add(tag));
        });

        setTags([...uniqueTags]);
      })
      .catch((error) => console.error("Error fetching challenges:", error));
  };

  // Filter challenges by selected tags
  const filterChallengesByTags = (challengesList, selectedTags) => {
    if (selectedTags.size === 0) return challengesList;
    return challengesList.filter((challenge) =>
      [...selectedTags].some(
        (tag) =>
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
      setFilteredChallenges(
        filterChallengesByTags(challenges, newSelectedTags)
      );
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

  const canScrollLeft = () =>
    scrollContainerRef.current && scrollContainerRef.current.scrollLeft > 0;

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
      <div className="subjects-container">
        <div className="subjects-box">
          <div className="subjects-label">Subjects:</div>
          <div className="find-challenge-container">
            <button className="find-challenge-button" onClick={togglePopup}>
              Find a Challenge
            </button>
          </div>
          <div className="subjects-carousel">
            <button
              className="arrow left"
              onClick={handlePrev}
            >
              &#10094;
            </button>
            <div className="subjects-display" ref={scrollContainerRef}>
              {subjects.map((subject) => (
                <div
                  key={subject.name}
                  className={`subject-item ${
                    selectedSubjectName === subject.name ? "selected" : ""
                  }`}
                  onClick={() => handleSubjectClick(subject.name)}
                >
                  <h3>{subject.name}</h3>
                  <p>{subject.description}</p>
                  <img src={subject.image} alt={subject.name} />
                </div>
              ))}
            </div>
            <button
              className="arrow right"
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
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="challenge-item">
                    {challenge.daily_question ? "Yes" : "No"}
                  </div>
                  <div className="challenge-item">
                    {challenge.challenge_title}
                  </div>
                  <div className="challenge-item">
                    {challenge.users_attempted}
                  </div>
                  <div className="challenge-item">{challenge.users_solved}</div>
                  <div className="challenge-item">
                    {challenge.solved ? "Yes" : "No"}
                  </div>
                  <div className="challenge-item">
                    <button>View Solution</button>
                  </div>
                </Link>
              ))}
            </div>

            <div className="challenges-pagination">
              <button
                onClick={handlePrevChallenges}
                disabled={currentPage === 0}
              >
                &#10094;
              </button>
              <button
                onClick={handleNextChallenges}
                disabled={
                  (currentPage + 1) * itemsPerPage >= filteredChallenges.length
                }
              >
                &#10095;
              </button>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="tags-container2">
          <div className="tags-label2">Tags:</div>
          <div className="tags-grid2">
            {tags.map((tag, index) => (
              <label key={index} className="tag2">
                <input
                  type="checkbox"
                  checked={selectedTags.has(tag)}
                  onChange={() => handleTagToggle(tag)}
                  className="tag-checkbox2"
                />
                <span className="tag-name2">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-button" onClick={togglePopup}>
              <X size={24} />
            </button>
            <h2>Find a Challenge</h2>
            {isLoading ? (
              <Loader size={48} className="loader" />
            ) : (
              <>
                <div className="tags-section2">
                  <h3>Subject Tags</h3>
                  {subjectTags.map((tag) => (
                    <button
                      key={tag}
                      className={`tag-button2 ${
                        selectedSubjectTags.includes(tag) ? "selected" : ""
                      }`}
                      onClick={() =>
                        setSelectedSubjectTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        )
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="tags-section2">
                  <h3>Content Tags</h3>
                  {contentTags.map((tag) => (
                    <button
                      key={tag}
                      className={`tag-button2 ${
                        selectedContentTags.includes(tag) ? "selected" : ""
                      }`}
                      onClick={() =>
                        setSelectedContentTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        )
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="difficulty-section">
                  <h3>Difficulty</h3>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />
                  <span>{difficulty}</span>
                </div>
                <button
                  className="search-button"
                  onClick={() =>
                    handleSearch(
                     difficulty,
                     selectedContentTags,
                     selectedSubjectTags
                    )
                  }
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Search"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;

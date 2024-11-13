import React, { useState, useEffect } from "react"; 
import SubjectsForYou from './SubjectsForYou';
import TrendingChallenges from './TrendingChallenges';
import ProfileStats from './ProfileStats';
import "./Homepage.css";

function Home({ isLoggedIn, username, streakData }) {
    const [subjects, setSubjects] = useState([]);
    const [challenges, setChallenges] = useState([]);

    // Fetch subjects (customize based on your requirements)
    useEffect(() => {
      // Fetch all subjects
      fetch('http://localhost:5000/api/subjects', {
        credentials: 'include', // Include cookies with the request
    })
          .then((response) => response.json())
          .then((data) => setSubjects(data))
          .catch((error) => console.error('Error fetching subjects:', error));
  }, []);

    // Fetch all challenges and pick 3 random ones
    useEffect(() => {
        fetch("http://localhost:5000/api/challenges", {
            credentials: 'include', // Include cookies with the request
        })
            .then((response) => response.json())
            .then((data) => {
                const randomChallenges = selectRandomChallengess(data, 3);
                setChallenges(randomChallenges);
            })
            .catch((error) => console.error("Error fetching challenges:", error));
            
    }, []);

    // Helper function to select random items from an array
    const selectRandomChallengess = (arr, num) => {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    };

    return (
        <div>
            <SubjectsForYou subjects={subjects} />
            <ProfileStats isLoggedIn={isLoggedIn} username={username} streakData={streakData} />
            <TrendingChallenges challenges={challenges} />
        </div>
    );
}

export default Home;
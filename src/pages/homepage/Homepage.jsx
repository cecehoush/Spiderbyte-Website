import React, { useState, useEffect } from "react"; 
import SubjectsForYou from './SubjectsForYou';
import TrendingProblems from './TrendingProblems';
import ProfileStats from './ProfileStats';
import "./Homepage.css";

function Home({ isLoggedIn, username, streakData }) {
    const [subjects, setSubjects] = useState([]);
    const [problems, setProblems] = useState([]);

    // Fetch subjects (customize based on your requirements)
    useEffect(() => {
      // Fetch all subjects
      fetch('http://localhost:5000/api/subjects')
          .then((response) => response.json())
          .then((data) => setSubjects(data))
          .catch((error) => console.error('Error fetching subjects:', error));
  }, []);

    // Fetch all problems and pick 3 random ones
    useEffect(() => {
        fetch("http://localhost:5000/api/problems")
            .then((response) => response.json())
            .then((data) => {
                const randomProblems = selectRandomProblems(data, 3);
                setProblems(randomProblems);
            })
            .catch((error) => console.error("Error fetching problems:", error));
    }, []);

    // Helper function to select random items from an array
    const selectRandomProblems = (arr, num) => {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    };

    return (
        <div>
            <SubjectsForYou subjects={subjects} />
            <ProfileStats isLoggedIn={isLoggedIn} username={username} streakData={streakData} />
            <TrendingProblems problems={problems} />
        </div>
    );
}

export default Home;


// import React, { useState, useEffect } from "react";
// import SubjectsForYou from './SubjectsForYou';
// import TrendingProblems from './TrendingProblems';
// import ProfileStats from './ProfileStats';
// import "./Homepage.css";

// function Home({isLoggedIn, username, streakData}) {

//     const [subjects, setSubjects] = useState([]);
//     const [problems, setProblems] = useState([]);

//     //this will fetch subjects recommended from the user instead of all of subjects
//     useEffect(() => {
//         fetch("/subjects.json")
//           .then((response) => response.json())
//           .then((data) => setSubjects(data));
//       }, []);

//     //this will fetch problems recommended from the user instead of all of problems
//     useEffect(() => {
//         fetch("/problems.json")
//           .then((response) => response.json())
//           .then((data) => setProblems(data));
//         }, []);

//     return (
//         <div>
//             <SubjectsForYou subjects={subjects}/>
//             <ProfileStats isLoggedIn={isLoggedIn} username={username} streakData={streakData}/>
//             <TrendingProblems problems={problems}/>
//         </div>
//     );
// }

// export default Home
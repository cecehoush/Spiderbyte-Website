import React, { useState, useEffect } from "react";
import SubjectsForYou from './SubjectsForYou';
import TrendingProblems from './TrendingProblems';
import ProfileStats from './ProfileStats';
import "./Homepage.css";

function Home({isLoggedIn, username, streakData}) {

    const [subjects, setSubjects] = useState([]);
    const [problems, setProblems] = useState([]);

    //this will fetch subjects recommended from the user instead of all of subjects
    useEffect(() => {
        fetch("/subjects.json")
          .then((response) => response.json())
          .then((data) => setSubjects(data));
      }, []);

    //this will fetch problems recommended from the user instead of all of problems
    useEffect(() => {
        fetch("/problems.json")
          .then((response) => response.json())
          .then((data) => setProblems(data));
        }, []);

    return (
        <div>
            <SubjectsForYou subjects={subjects}/>
            <ProfileStats isLoggedIn={isLoggedIn} username={username} streakData={streakData}/>
            <TrendingProblems problems={problems}/>
        </div>
    );
}

export default Home
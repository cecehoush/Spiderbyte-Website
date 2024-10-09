import React from "react";
import "./Homepage.css";
import SubjectsGrid from "./SubjectsGrid";

export default function SubjectsForYou({subjects}) {
  return (
    <div className="subjects-for-you">
      <div className="subjects-for-you-title">
        <h1>Subjects For You:</h1>
      </div>
      <SubjectsGrid subjects={subjects}/>
    </div>
  );
}

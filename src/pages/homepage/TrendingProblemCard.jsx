import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

export default function ProblemCard({ problem }) {
    return (
        <Link 
            to={`/editor/${problem._id}`} 
            className="problem-card-link"
            style={{ textDecoration: 'none', color: 'inherit' }}
        >
            <div className="problem-card">
                <div className="problem-card-title">
                    <h1>{problem.challenge_title}</h1>
                </div>
            </div>
        </Link>
    );
}

// import React from "react";
// import "./Homepage.css";

// export default function ProblemCard({problem}) {
//     return (
//         <a href={`/problems/${problem.id}`} className=".problem-card-link">
//         <div className="problem-card">
//             <div className="problem-card-title">
//                 <h1>{problem.challenge_title}</h1>
//             </div>
//         </div>
//         </a>
//     );
// }
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the challengeId
import MonacoEditor from './CodeEditorWin';
import './CodeEditor.css';

function CodeEditorPage() {
  const { challengeId } = useParams(); // Get challengeId from route params
  const [challengeData, setChallengeData] = useState(null);
  const [usercode, setCode] = useState('// Write your solution here...');
  const [testCases, setTestCases] = useState([]);
  const [executionTime, setExecutionTime] = useState([]);
  const [resultString, setResultString] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isVisualizerVisible, setIsVisualizerVisible] = useState(false);
  const [hintsVisibility, setHintsVisibility] = useState([]); // Track visibility for each hint
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const socketRef = useRef(null); // Store socket in ref to persist across renders
  const clientIdRef = useRef(null); // Store clientId in ref
  const sessionIdRef = useRef(null); // Store sessionId in ref

  // Connect to WebSocket server
  const connectWebSocket = () => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data); // Parse incoming data
      console.log('Received data:', data);
      
      if (!clientIdRef.current) {
        clientIdRef.current = data.clientId; // Store the clientId in the ref
        localStorage.setItem('clientId', data.clientId); // Save to localStorage
        console.log("Client Id from the websocket: ", data.clientId);
      }

      if (!sessionIdRef.current) {
        sessionIdRef.current = data.sessionId; // Store the sessionId in the ref
        localStorage.setItem('sessionId', data.sessionId); // Save to localStorage
        console.log("SessionId in code editor:", sessionIdRef.current);
      }

      // Assuming the results contain execution time and test case results
      if (data.results) {
        console.log("RESULTS", data.results);
        setResultString(data.results || "NA");
        setIsPopupVisible(true); // Show test case results popup
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return socket;
  };

  // Initialize WebSocket connection on mount
  useEffect(() => {
    socketRef.current = connectWebSocket(); // Store socket reference

    // Cleanup function to close WebSocket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []); // supposed to only run once mount

  useEffect(() => {
    // Fetch challenge data based on the challengeId from route
    fetch(`http://localhost:5000/api/challenges/${challengeId}`, {
      credentials: 'include', // Include cookies with the request
  })
      .then((response) => response.json())
      .then((data) => {
        setChallengeData(data);
        setCode(data.skeleton_code.code);
        setTestCases(data.test_cases);
        setHintsVisibility(new Array(data.hints ? data.hints.length : 0).fill(false)); // Initialize hints visibility
      })
      .catch((error) => console.error('Failed to fetch challenge data:', error));
  }, [challengeId]);

  const runCode = async () => {
    try {
      console.log("Run code initiated");
      
      // Extract the function name and parameters from user's code
      const functionNameMatch = usercode.match(/def\s+(\w+)\s*\(([^)]*)\)/);
      if (!functionNameMatch) {
        console.error("No valid function found in user code.");
        return;
      }
      
      const functionName = functionNameMatch[1];
      const functionParams = functionNameMatch[2];
      const paramCount = functionParams.split(",").filter(param => param.trim() !== "").length;
      const inputParams = Array.from({ length: paramCount }, (_, i) => `input${i + 1}`).join(", ");
      const codeWithFunctionCall = `${usercode}\n\nresult = ${functionName}(${inputParams})`;
      
      // Prepare data for submission
       const submissionData = {
        userid: -1, // Replace with actual logged-in user's ID if applicable
        clientId: clientIdRef.current, // Use ref value
        sessionId: sessionIdRef.current, // Use ref value
        usercode: codeWithFunctionCall,
        test_cases: challengeData.test_cases,
      };
      
      console.log("Sending submission data:", submissionData);
  
      // Create a new XMLHttpRequest object
      const xhr = new XMLHttpRequest();

      // Configure it: POST-request for the URL /api/submissions
      xhr.open("POST", "http://localhost:5000/api/submissions", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.withCredentials = true;
      // Send the request with the data as JSON
      xhr.send(JSON.stringify(submissionData));

      // Optional: Handle the load event if you want to do something when the request completes
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Request sent successfully.");
        } else {
          console.error("Request failed with status:", xhr.status);
        }
      };

      // Optional: Handle errors
      xhr.onerror = () => {
        console.error("Request failed due to a network error.");
      }
    } catch (error) {
      console.error("Error during code submission:", error);
      alert("An error occurred during submission. Please try again.");
    }
  };
    
  const openVisualizer = () => {
    setIsVisualizerVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const closeVisualizer = () => {
    setIsVisualizerVisible(false);
  };

  const toggleHintVisibility = (index) => {
    setHintsVisibility((prevVisibility) =>
      prevVisibility.map((isVisible, i) => (i === index ? !isVisible : isVisible))
    );
  };

  if (!challengeData) {
    return <div>Building Web...</div>;
  }

  // Generate the URL for PythonTutor visualization
  const generatePythonTutorURL = () => {
    const encodedCode = encodeURIComponent(usercode);
    return `https://pythontutor.com/iframe-embed.html#code=${encodedCode}&origin=opt-frontend.js&cumulative=false&heapPrimitives=nevernest&textReferences=false&py=3&curInstr=0`;
  };

  return (
    <div className="page-container">
      <div className="description-container">
        <div className="problem-description">
          <div className="section-header">
            <h2 className="challenge-title">{challengeData.challenge_title}</h2>
          </div>
          <div className="content-section">
            <p className="description">{challengeData.challenge_description.description}</p>
          </div>
          <div className="content-section">
            <h3 className="sub-section-title">Input Format</h3>
            <p className="input-format">{challengeData.challenge_description.input_format}</p>
          </div>
          <div className="content-section">
            <h3 className="sub-section-title">Output Format</h3>
            <p className="output-format">{challengeData.challenge_description.output_format}</p>
          </div>
          <div className="content-section">
            <h3 className="sub-section-title">Constraints</h3>
            <p className="constraints">{challengeData.challenge_description.constraints}</p>
          </div>
          <div className="hints-section">
            <h3 className="sub-section-title">Hints</h3>
            {challengeData.hints && challengeData.hints.length > 0 ? (
              challengeData.hints.map((hint, index) => (
                <div key={index} className="hint-container">
                  <button
                    className="toggle-hint-button"
                    onClick={() => toggleHintVisibility(index)}
                  >
                    {hintsVisibility[index] ? 'Hide Hint' : `Show Hint ${index + 1}`}
                  </button>
                  {hintsVisibility[index] && (
                    <p className="hint-item">{hint}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="no-hints">No hints available.</p>
            )}
          </div>
        </div>
      </div>
      <div className="editor-container" ref={containerRef}>
        <div className="editor-wrapper">
          <MonacoEditor
            language={challengeData.skeleton_code.language}
            value={usercode}
            onChange={(newValue) => setCode(newValue)}
            editorDidMount={(editor) => {
              editorRef.current = editor;
              editor.layout();
            }}
            options={{ automaticLayout: true }}
          />
          {/* Visualizer Button */}
          <button onClick={openVisualizer} className="eyeball-button">
            <svg viewBox="0 0 24 24">
              <path
                fill="#53D597"
                d="M12,4.5C7.5,4.5,3.7,7.6,2,12c1.7,4.4,5.5,7.5,10,7.5s8.3-3.1,10-7.5C20.3,7.6,16.5,4.5,12,4.5z M12,17 c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S14.8,17,12,17z M12,9c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S13.7,9,12,9z"
              />
            </svg>
          </button>
          {/* Run Code Button */}
          <button onClick={runCode} className="play-button">
            <svg viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" fill="#53D597" />
            </svg>
          </button>
        </div>

        {/* Popup for test case results */}
        {isPopupVisible && (
          <div className="popup-container">
            <div className="popup-content">
              <button className="close-button" onClick={closePopup}>
                ✖
              </button>
              <h3>Results:</h3>
              <h4> {resultString} </h4>
            </div>
          </div>
        )}
      </div>

      {/* Visualizer Window */}
      {isVisualizerVisible && (
        <div className="visualizer-container">
          <div className="visualizer-content">
            <button className="close-button" onClick={closeVisualizer}>
              ✖
            </button>
            <iframe
              src={generatePythonTutorURL()}
              width="100%"
              height="500px"
              title="Python Tutor"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeEditorPage;

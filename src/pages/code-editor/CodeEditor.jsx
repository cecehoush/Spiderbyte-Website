import { useState, useRef, useEffect } from 'react';
import MonacoEditor from './CodeEditorWin';
import './CodeEditor.css';

function CodeEditorPage() {
  const [problemData, setProblemData] = useState(null);
  const [usercode, setCode] = useState('// Write your solution here...');
  const [testCases, setTestCases] = useState([]);
  const [executionTime, setExecutionTime] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isVisualizerVisible, setIsVisualizerVisible] = useState(false);
  const [hintsVisibility, setHintsVisibility] = useState([]); // New state for tracking each hint's visibility
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Fetch the problem data from the JSON file
    fetch('./test-json/test1.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProblemData(data);
        setCode(data.skeleton_code.code);
        setTestCases(data.test_cases);
        setHintsVisibility(new Array(data.hints ? data.hints.length : 0).fill(false)); // Initialize visibility for each hint as false
      })
      .catch((error) => {
        console.error('Failed to fetch problem data:', error);
      });
  }, []);

  const runCode = async () => {
    try {
    // Step 1: Extract the function name (assuming the first function defined)
    const functionNameMatch = usercode.match(/def\s+(\w+)\s*\(([^)]*)\)/);
    if (!functionNameMatch) {
      console.error('No valid function found in user code.');
      return;
    }
    
    const functionName = functionNameMatch[1]; // Get the function name
    const functionParams = functionNameMatch[2]; // Get the parameter list from the function definition

    // Step 2: Count the number of inputs in the function definition
    const paramCount = functionParams.split(',').filter(param => param.trim() !== '').length;

    // Step 3: Build the input variables (e.g., input1, input2, ..., inputN)
    const inputParams = Array.from({ length: paramCount }, (_, i) => `input${i + 1}`).join(", ");

    // Step 4: Append the function call to the user's code
    const codeWithFunctionCall = `${usercode}\n\nresult = ${functionName}(${inputParams})`;

      console.log(problemData.test_cases);
      const submissionData = {
        userid: '-1', // Replace with actual logged-in user's ID, -1 if none
        usercode: codeWithFunctionCall,
        test_cases: problemData.test_cases,
      };
  
      const response = await fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Submission sent successfully:', responseData);
        // You can also update the UI to reflect the submission status
      } else {
        const errorText = await response.text();
        console.error('Failed to send submission:', errorText);
      }
    } catch (error) {
      console.error('Error sending submission:', error);
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

  if (!problemData) {
    return <div>Building Web...</div>;
  }

  // Function to generate the PythonTutor URL with the user's code
  const generatePythonTutorURL = () => {
    const encodedCode = encodeURIComponent(usercode);
    return `https://pythontutor.com/iframe-embed.html#code=${encodedCode}&origin=opt-frontend.js&cumulative=false&heapPrimitives=nevernest&textReferences=false&py=3&curInstr=0`;
  };

  return (
    <div className="page-container">
      <div className="description-container">
        <div className="problem-description">
          <div className="section-header">
            <h2 className="challenge-title">{problemData.challenge_title}</h2>
          </div>
          <div className="content-section">
            <p className="description">{problemData.problem_description.description}</p>
          </div>
          <div className="content-section">
            <h3 className="sub-section-title">Input Format</h3>
            <p className="input-format">{problemData.problem_description.input_format}</p>
          </div>
          <div className="content-section">
            <h3 className="sub-section-title">Output Format</h3>
            <p className="output-format">{problemData.problem_description.output_format}</p>
          </div>
          <div className="content-section">
            <h3 className="sub-section-title">Constraints</h3>
            <p className="constraints">{problemData.problem_description.constraints}</p>
          </div>
          <div className="hints-section">
            <h3 className="sub-section-title">Hints</h3>
            {problemData.hints && problemData.hints.length > 0 ? (
              problemData.hints.map((hint, index) => (
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
          language={problemData.skeleton_code.language}
          value={usercode}
          onChange={(newValue) => setCode(newValue)} // Update the user's code state with new input
          editorDidMount={(editor) => {
            editorRef.current = editor;
            editor.layout();
          }}
          options={{ automaticLayout: false }}
        />
          {/* Eyeball button for visualizer */}
          <button onClick={openVisualizer} className="eyeball-button">
            <svg viewBox="0 0 24 24">
              <path
                fill="#53D597"
                d="M12,4.5C7.5,4.5,3.7,7.6,2,12c1.7,4.4,5.5,7.5,10,7.5s8.3-3.1,10-7.5C20.3,7.6,16.5,4.5,12,4.5z M12,17 c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S14.8,17,12,17z M12,9c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S13.7,9,12,9z"
              />
            </svg>
          </button>
          {/* Play button */}
            <button onClick={() => { 
              console.log("Play button clicked");
              runCode();
            }} 
            className="play-button">
            <svg viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" fill="#53D597" />
            </svg>
          </button>
        </div>
        {/* Popup for test cases */}
      {isPopupVisible && (
        <div className="popup-container">
          <div className="popup-content">
            <button className="close-button" onClick={closePopup}>
              ✖
            </button>
            <h3>Test Cases</h3>
            <ul>
              {testCases.map((testCase, index) => (
                <li key={index}>
                  <strong>Input:</strong> {JSON.stringify(testCase.input)} |{' '}
                  <strong>Expected Output:</strong> {testCase.expected_output}
                </li>
              ))}
            </ul>
            {executionTime && (
              <p>
                <strong>Execution Time:</strong> {executionTime} ms
              </p>
            )}
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

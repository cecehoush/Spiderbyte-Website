import React, { useState, useRef } from 'react';
import MonacoEditor from '../components/CodeEditor';
import ReactMarkdown from 'react-markdown';
import '../styles/CodeEditor.css';

function CodeEditorPage() {
  const [code, setCode] = useState('// Write your solution here...');
  const [testCases] = useState([
    { input: '[1, -2, 3, 4]', expectedOutput: 8 },
    { input: '[5, 10, -5, -1]', expectedOutput: 15 }
  ]);
  const [executionTime, setExecutionTime] = useState(null);
  const editorRef = useRef(null);
  const containerRef = useRef(null); // Reference to the editor container



  const runCode = () => {
    const startTime = performance.now();
    setTimeout(() => {
      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(2));
    }, 500);
  };

  return (
    <div className="page-container">
      <div className="description-container">
        <ReactMarkdown children={markdownProblem} />
      </div>
      <div className="editor-container" ref={containerRef}> {/* Attach ref to container */}
        <div className="editor-wrapper">
          <MonacoEditor
            language="python"
            value={code}
            onChange={setCode}
            editorDidMount={(editor) => {
              editorRef.current = editor;
              editor.layout(); // Force initial layout
            }}
            options={{ automaticLayout: false }} // Disable Monaco's built-in automatic layout
          />
        </div>
        <div className="submission-container">
          <h3>Test Cases</h3>
          <ul>
            {testCases.map((testCase, index) => (
              <li key={index}>
                <strong>Input:</strong> {testCase.input} | <strong>Expected Output:</strong> {testCase.expectedOutput}
              </li>
            ))}
          </ul>
          <button onClick={runCode} className="run-button">Run</button>
          {executionTime && (
            <p><strong>Execution Time:</strong> {executionTime} ms</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeEditorPage;


  // Markdown content for the coding problem
  const markdownProblem = `
  # Coding Challenge

  **Problem Statement**:

  Write a function that takes an array of integers and returns the sum of all the positive integers.

  **Input**: An array of integers (e.g., \`[1, -2, 3, 4]\`).

  **Output**: A single integer representing the sum of all positive integers.

  **Example**:
  \`\`\`
  Input: [1, -2, 3, 4]
  Output: 8
  \`\`\`

  **Constraints**:
  - The array will have at least one integer.
  - The integers can be positive, negative, or zero.
  `;